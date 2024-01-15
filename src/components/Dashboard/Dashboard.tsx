import {
  ChainSlug,
  DeploymentMode,
  Project,
  getSuperBridgeAddresses,
  Tokens,
  ProjectAddresses,
} from "@socket.tech/socket-plugs";
import toast from "react-hot-toast";
import { ChainId } from "@socket.tech/dl-core";

import { Button, Empty, Input, Select, Spin } from "antd";
import { ethers } from "ethers";
import { useRef, useState } from "react";
import {
  // contractABI,
  contractABI as nonAppChain,
} from "../../contracts/ContractAbi";
import { appChain } from "../../contracts/AppChain";
import { tokenDecimals, RpcEnum } from "../../constants/consts";
// import fetchEnumDefinitions from "../../helper/enum-service";
import DetailsCard from "../DetailCard/DetailsCard";
import LimitUpdateModal from "../LimitUpdateModal";
import { convertTimestampToIndianDateTime } from "../../helper/basicFunctions";
import { useAtom } from "jotai";
import { userAddress } from "../../atoms/atoms";

const Dashboard = () => {
  const [selectedDeploymentMode, setSelectedDeploymentMode] =
    useState<DeploymentMode>(DeploymentMode.PROD);
  const [tokenOwner, setTokenOwner] = useState<any>({});

  const [selectedChain, setSelectedChain] = useState<any>();

  const [fetchedResults, setFetchedResults] = useState<any>({});
  const [selectedProject, setSelectedProject] = useState<Project>();
  const [isFetchingLimits, setIsFetchingResults] = useState(false);
  const [chains, setChains] = useState([]) as any;
  const [selectedChainsDetails, setSelectedChainsDetails] = useState<any>();
  const [changeRpcUrl, setChangeRpcUrl] = useState<boolean>(false);

  const [rpcUrl, setRpcUrl] = useState<string>(
    RpcEnum[Number(ChainSlug[selectedChain])]
  );

  const handleModeChange = (e: any) => {
    const mode = e;
    setSelectedDeploymentMode(mode);
    getChains(selectedProject!, e);
  };

  const allDeploymentModes = [
    {
      label: "Production",
      value: DeploymentMode.PROD,
    },

    {
      label: "Development",
      value: DeploymentMode.DEV,
    },
    {
      label: "Surge",
      value: DeploymentMode.SURGE,
    },
  ];

  const allProjects = Object.keys(Project).map((key) => {
    return {
      label: Project[key as keyof typeof Project],
      value: Project[key as keyof typeof Project],
    };
  });

  const getChains = async (project: string, mode: string) => {
    // console.log(selectedDeploymentMode);
    // console.log(selectedProject);
    try {
      if (!selectedDeploymentMode) return alert("Select All Fields");
      console.log("Project", project);
      console.log("Deployment", mode);

      if (selectedDeploymentMode && !project) return;

      setSelectedChain(undefined);
      setSelectedProject(project as Project);

      const addresses = await getSuperBridgeAddresses(
        (mode as DeploymentMode) || DeploymentMode.PROD,
        (project as Project) || Project.AEVO
      );

      setChains(() => {
        return Object.keys(addresses).map((address: any) => {
          return {
            label: ChainSlug[address],
            value: ChainSlug[address],
          };
        });
      });
      setSelectedChain(ChainSlug[Object.keys(addresses)[0] as any]);
      console.log(
        "Selected Chain",
        ChainSlug[Object.keys(addresses)[0] as any]
      );

      console.log(
        "RPC here",
        RpcEnum[
          Number(ChainSlug[ChainSlug[Object.keys(addresses)[0] as any] as any])
        ]
      );

      setRpcUrl(
        RpcEnum[
          Number(ChainSlug[ChainSlug[Object.keys(addresses)[0] as any] as any])
        ]
      );

      setSelectedChainsDetails(addresses as ProjectAddresses);
    } catch (error) {
      console.log(error);
      toast.error(`Error fetching chains for Mode ${mode} Project ${project}`, {
        duration: 5000,
        position: "top-right",
      });
    }
  };

  let collect: any = [];
  async function callContractFunction({
    rpcUrl,
    tokenDecimal,
    functionToCall,
    contractAddress,
    connectorAddressList,
    token,
    contractABI,
    isAppChain,
  }: // owner,
  {
    rpcUrl: string;
    tokenDecimal: number;
    functionToCall: {
      paramsForLockOrMint: string;
      paramsForUnlockOrBurn: string;
      getCurrentLockOrMintLimit: string;
      getCurrentBurnOrUnlockLimit: string;
    };
    contractAddress: string;
    connectorAddressList: any;
    token: string;
    contractABI: any;
    isAppChain: boolean;
  }) {
    try {
      setIsFetchingResults(true);

      const provider = new ethers.JsonRpcProvider(rpcUrl);

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );

      let connectorsResultArr = [];

      for (const connector in connectorAddressList) {
        const currentConnector = connectorAddressList[connector];

        for (const curr in currentConnector) {
          const constructResult = (
            tokenDecimal: number,
            result: any,
            currentLimit: any
          ) => {
            // console.log("DATA TO CONTRUCT", data);
            try {
              const maxValue = BigInt(Number.MAX_SAFE_INTEGER);
              const obj: any = {};
              Object.values(result).forEach((value: any, index: any) => {
                if (index === 0) {
                  // const date = new Date(Number(value) * 1000);
                  obj["lastUpdateTimestamp"] = Number(value);
                } else if (index === 1) {
                  obj["ratePerSecond"] = Number(
                    ethers.formatUnits(value, tokenDecimal)
                  ).toFixed(4);
                } else if (index === 2) {
                  const maxLimit =
                    BigInt(value) > maxValue ? value : BigInt(value);
                  obj["maxLimit"] = Number(
                    ethers.formatUnits(maxLimit, tokenDecimal)
                  ).toFixed(2);
                } else if (index === 3) {
                  const lastUpdateLimit =
                    BigInt(value) > maxValue ? value : BigInt(value);
                  obj["lastUpdateLimit"] = Number(
                    ethers.formatUnits(lastUpdateLimit, tokenDecimal)
                  ).toFixed(2);
                }
              });

              // const currentLimit = calculateLimit(obj);
              const currentLimitValue =
                BigInt(currentLimit) > maxValue
                  ? currentLimit
                  : BigInt(currentLimit);

              obj["currentLimit"] = Number(
                ethers.formatUnits(currentLimitValue, tokenDecimal)
              ).toFixed(2);

              return obj;
            } catch (error) {
              console.log("Error in Result construct", error);
            }
          };

          const resultParamsForLockOrMint = await contract[
            functionToCall.paramsForLockOrMint
          ](currentConnector[curr]);

          const resultParamsForUnlockOrBurn = await contract[
            functionToCall.paramsForUnlockOrBurn
          ](currentConnector[curr]);

          const getCurrentLockOrMintLimit = await contract[
            functionToCall.getCurrentLockOrMintLimit
          ](currentConnector[curr]);

          const getCurrentBurnOrUnlockLimit = await contract[
            functionToCall.getCurrentBurnOrUnlockLimit
          ](currentConnector[curr]);

          const lockOrMintLimitObject = constructResult(
            tokenDecimal,
            resultParamsForLockOrMint,
            getCurrentLockOrMintLimit
          );

          const unlockOrBurnLimitObject = constructResult(
            tokenDecimal,
            resultParamsForUnlockOrBurn,
            getCurrentBurnOrUnlockLimit
          );

          // console.log("LockOrMint", lockOrMintLimitObject);
          // console.log("UnlockOrBurn", unlockOrBurnLimitObject);

          // console.log("Result:", result);
          const obj = {
            token,
            source: selectedChain,
            DestToken: ChainId[connector as any],
            isAppChain,
            connectorType: curr,
            connectorAddr: currentConnector[curr],
            contractAddress,

            Result: {
              LockOrMint: lockOrMintLimitObject,
              UnlockOrBurn: unlockOrBurnLimitObject,
            },
          };

          connectorsResultArr.push(obj);
        }
      }

      collect.push(...connectorsResultArr);
    } catch (error) {
      console.error("Error calling contract function:", error);
    } finally {
    }
  }

  const handleProjectChange = (e: any) => {
    // console.log(e);

    setSelectedProject(e);
    // getChains(selectedDeploymentMode, e);
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const onSearch = (value: string) => {
    console.log("search:", value);
  };

  console.log("Loading state", isFetchingLimits);

  const fetchLimits = async () => {
    // console.log(selectedChainsDetails);

    const currentChain = ChainSlug[selectedChain as any];

    if (!selectedChainsDetails) {
      return toast.error("Please select a project", {
        duration: 5000,
        position: "top-right",
      });
    }

    if (!rpcUrl) {
      return toast.error("Please enter RPC Url", {
        duration: 5000,
        position: "top-right",
      });
    }

    console.log(selectedChainsDetails);

    const currentChainData = selectedChainsDetails[currentChain];

    // const dummy = {
    //   USDC: {
    //     isAppChain: false,
    //     NonMintableToken: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    //     Vault: "0xFff4A34925301d231ddF42B871c3b199c1E80584",
    //     connectors: {
    //       "2999": {
    //         FAST: "0x1812ff6bd726934f18159164e2927B34949B16a8",
    //         SLOW: "0x1812ff6bd726934f18159164e2927B34949B16a8",
    //       },
    //     },
    //   },
    //   WETH: {
    //     isAppChain: false,
    //     NonMintableToken: "0x4200000000000000000000000000000000000006",
    //     Vault: "0x5c7Dd6cb73d93879E94F20d103804C495A10aE7e",
    //     connectors: {
    //       "2999": {
    //         FAST: "0xeCaa2435d99c4987876A0382F1661dBf539700C0",
    //       },
    //     },
    //   },
    // };

    const whichFunctionToRun = (isAppChain: boolean) => {
      if (!isAppChain) {
        return {
          paramsForLockOrMint: "getLockLimitParams",
          paramsForUnlockOrBurn: "getUnlockLimitParams",
          getCurrentLockOrMintLimit: "getCurrentLockLimit",
          getCurrentBurnOrUnlockLimit: "getCurrentUnlockLimit",
        };
      } else {
        return {
          paramsForLockOrMint: "getMintLimitParams",
          paramsForUnlockOrBurn: "getBurnLimitParams",
          getCurrentLockOrMintLimit: "getCurrentMintLimit",
          getCurrentBurnOrUnlockLimit: "getCurrentBurnLimit",
        };
      }
    };

    const whichContractAddressToUse = (isAppChain: boolean) => {
      if (!isAppChain) {
        return "Vault";
      } else {
        return "Controller";
      }
    };

    let owners: any = {};
    for (const token in currentChainData) {
      // setOwner(owner);
      const currentDetails = currentChainData[token];
      // const rpcUrl = RpcEnum[Number(ChainSlug[selectedChain])];
      const tokenDecimal = tokenDecimals[token as Tokens];
      const functionToCall = whichFunctionToRun(currentDetails?.isAppChain);
      const connectorAddressList = currentDetails.connectors;
      // console.log("connectors", connectorAddressList);

      const contractAddress = whichContractAddressToUse(
        currentDetails?.isAppChain
      );

      const contractABI = currentDetails?.isAppChain ? appChain : nonAppChain;

      const provider = new ethers.JsonRpcProvider(rpcUrl);
      console.log("Current Details ->", currentDetails[contractAddress]);
      console.log("Current addr ->", contractAddress);

      const contract = new ethers.Contract(
        currentDetails[contractAddress],
        contractABI,
        provider
      );

      const owner = await contract.owner();

      owners[token] = owner;

      await callContractFunction({
        connectorAddressList,
        contractAddress: currentDetails[contractAddress],
        functionToCall,
        rpcUrl,
        tokenDecimal,
        token,
        contractABI,
        isAppChain: currentDetails?.isAppChain,
        // owner,
      });
    }

    setIsFetchingResults(false);
    let obj: any = {};
    setTokenOwner(owners);

    collect.forEach((element: any) => {
      if (obj[element?.token]) {
        obj[element.token].push(element);
      } else {
        obj[element?.token] = [];
        obj[element?.token].push(element);
      }
    });

    console.log("Hmmm", obj);

    setFetchedResults(obj);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col justify-between   items-center   min-h-screen w-full">
      <div className="text-white w-full px-4 py-6 sm:py-[62px] flex flex-col items-center justify-center text-center bg-[#7f1fff]">
        <div className="relative flex flex-col mx-auto items-center  max-w-[1280px] ">
          <h1 className="text-3xl md:text-4xl font-semibold">
            Superbridge Dashboard
          </h1>
          <p className="text-sm text-center sm:text-base max-w-[960px] sm:px-5 md:font-medium font-matterLight mb-6 mt-4 sm:mt-2">
            Track all your bridge transactions limit across Ethereum, Optimism,
            Arbitrum, Polygon, Base, zkSync Era, Polygon zkEVM, BNB Chain,
            Avalanche, Gnosis Chain, Zora, Fantom, and Aurora.
          </p>
          <div className="w-full mt-2 grid grid-cols-1  md:grid-rows-2 gap-4 rounded-lg max-w-[400px]     border-opacity-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="flex items-start flex-col gap-2 rounded-lg">
                <h1 className="text-base font-bold">Select mode</h1>
                <Select
                  size="large"
                  className="w-full"
                  defaultValue={DeploymentMode.PROD}
                  onSelect={(e) => {
                    handleModeChange(e);
                  }}
                  options={allDeploymentModes}
                />
              </div>

              <div className="flex items-start flex-col gap-2">
                <h1 className="text-base font-bold">Select Project</h1>
                <Select
                  className="w-full"
                  size="large"
                  showSearch
                  placeholder="Select a project"
                  optionFilterProp="children"
                  onSelect={(e) => {
                    getChains(e, selectedDeploymentMode);
                  }}
                  onChange={handleProjectChange}
                  onSearch={onSearch}
                  filterOption={filterOption}
                  options={allProjects}
                />
              </div>
            </div>

            <div>
              {chains.length > 0 && (
                <div className="flex flex-col md:flex-row gap-4  w-full">
                  <div className="flex items-start flex-col gap-2 w-full">
                    <h1 className="text-base font-bold">Select Chain</h1>
                    <Select
                      size="large"
                      placeholder="Select a Chain"
                      value={selectedChain || chains[0]?.value}
                      autoClearSearchValue={true}
                      className="w-full"
                      onChange={(e) => {
                        setSelectedChain(e);
                        setRpcUrl(RpcEnum[Number(ChainSlug[e])]);
                      }}
                      options={chains}
                    />
                  </div>

                  <div className="flex items-end w-full">
                    <Button
                      disabled={chains.length === 0}
                      onClick={fetchLimits}
                      size="large"
                      className="w-full bg-black text-white border-black"
                    >
                      Fetch Limits
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {changeRpcUrl && (
              <div className=" flex flex-col items-start gap-2">
                <h1 className="text-base font-bold">Rpc Url</h1>
                <Input
                  size="large"
                  onChange={(e) => setRpcUrl(e.target.value)}
                  value={rpcUrl}
                  placeholder={`Enter RPC Url for ${selectedChain?.toLowerCase()} Chain`}
                />
              </div>
            )}
            {!changeRpcUrl && chains.length > 0 && (
              <div
                onClick={() => setChangeRpcUrl(true)}
                className="flex ml-1 items-end w-full"
              >
                <p className="text-sm cursor-pointer">Change RPC ?</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <section className=" gap-6 bg-gray-100   flex-1 justify-center flex items-center   w-full">
        {!isFetchingLimits ? (
          <div className="flex flex-wrap gap-3 p-2  w-full    justify-center md:p-10">
            {Object.keys(fetchedResults).length > 0 ? (
              Object.keys(fetchedResults).map((token: any, index) => (
                <div
                  key={index}
                  className="  rounded-lg bg-white w-full md:w-auto flex flex-col items-center p-2 md:p-10 gap-10 "
                >
                  <div className="flex flex-col gap-1 items-center">
                    <h1 className="text-2xl font-semibold">{token}</h1>
                    <div className="flex flex-col gap-3">
                      <div className="md:flex md:gap-3 flex gap-2 text-nowrap ">
                        <p className="font-bold">Owner :</p>
                        <p className="text-gray-700">
                          {/* {tokenOwner[token] || "N/A"} */}
                          {tokenOwner[token].slice(0, 6) +
                            "..." +
                            tokenOwner[token].slice(-4)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="  flex flex-wrap   w-full justify-center gap-3 ">
                    {fetchedResults[token]?.map((item: any, index: any) => (
                      <DetailsCard
                        key={index}
                        setIsModalOpen={setIsModalOpen}
                        isModalOpen={isModalOpen}
                        details={item}
                        owner={tokenOwner[token]}
                        rpc={rpcUrl}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full text-white  w-full flex-1 ">
                <Empty />
              </div>
            )}
          </div>
        ) : (
          <div className=" flex ">
            <Spin tip="Loading" size="large" className="" />
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
