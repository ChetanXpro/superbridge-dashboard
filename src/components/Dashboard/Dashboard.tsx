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

import { Empty, Input, Select } from "antd";
import { ethers } from "ethers";
import { useState } from "react";
import {
  // contractABI,
  contractABI as nonAppChain,
} from "../../contracts/ContractAbi";
import { appChain } from "../../contracts/AppChain";
import { tokenDecimals, RpcEnum } from "../../constants/consts";
// import fetchEnumDefinitions from "../../helper/enum-service";
import DetailsCard from "../DetailCard/DetailsCard";
import Loading from "../Loading";

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
  const [isTextCopied, setIsTextCopied] = useState<boolean>(false);
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

    const dummy: any = {
      USDC: {
        isAppChain: true,
        MintableToken: "0xC06Ed0eB5c0e25fa71B37A3F33CFa62C7d9dD542",
        ExchangeRate: "0xF31491ea094a2666Bd4BE9E7D72EC903c0407e4e",
        Controller: "0xC927FBD7254E0f7337Df1D539AA2bd60AFb44F02",
        connectors: {
          "421614": {
            FAST: "0x7050b6f947BA48508219Ac02EC152E9f198ADc5e",
          },
          "11155420": {
            FAST: "0xb584D4bE1A5470CA1a8778E9B86c81e165204599",
          },
        },
      },
      WETH: {
        isAppChain: false,
        NonMintableToken: "0x4200000000000000000000000000000000000006",
        Vault: "0x5c7Dd6cb73d93879E94F20d103804C495A10aE7e",
        connectors: {
          "2999": {
            FAST: "0xeCaa2435d99c4987876A0382F1661dBf539700C0",
          },
        },
      },
    };

    // {
    //   "421614": {
    //     "USDC": {
    //       "isAppChain": false
    //     }
    //   },

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

    const data: any = {
      // "11155111": {
      USDC: {
        isAppChain: true,
        MintableToken: "0xC06Ed0eB5c0e25fa71B37A3F33CFa62C7d9dD542",
        ExchangeRate: "0xF31491ea094a2666Bd4BE9E7D72EC903c0407e4e",
        Controller: "0xC927FBD7254E0f7337Df1D539AA2bd60AFb44F02",
        connectors: {
          "421614": {
            FAST: "0x7050b6f947BA48508219Ac02EC152E9f198ADc5e",
          },
          "11155420": {
            FAST: "0xb584D4bE1A5470CA1a8778E9B86c81e165204599",
          },
        },
      },
      // },
    };

    let owners: any = {};
    for (const token in data) {
      // setOwner(owner);
      console.log("Token", token);

      const currentDetails = data[token];

      console.log("Current Details", currentDetails);

      // const rpcUrl = RpcEnum[Number(ChainSlug[selectedChain])];
      const tokenDecimal = tokenDecimals[token as Tokens];
      const functionToCall = whichFunctionToRun(currentDetails?.isAppChain);
      const connectorAddressList = currentDetails.connectors;
      // console.log("connectors", connectorAddressList);

      const contractAddress = whichContractAddressToUse(
        currentDetails?.isAppChain
      );

      const contractABI = currentDetails?.isAppChain ? appChain : nonAppChain;

      const provider = new ethers.JsonRpcProvider(
        "https://ethereum-sepolia.publicnode.com"
      );
      console.log("Current Details ->", currentDetails[contractAddress]);
      console.log("Current addr ->", contractAddress);
      setIsFetchingResults(true);
      const contract = new ethers.Contract(
        currentDetails[contractAddress],
        contractABI,
        provider
      );

      const owner = await contract.owner();

      console.log("Owner", owner);

      owners[token] = owner;

      await callContractFunction({
        connectorAddressList,
        contractAddress: currentDetails[contractAddress],
        functionToCall,
        rpcUrl: "https://ethereum-sepolia.publicnode.com",
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
  const [copyTextIndex, setCopyTextIndex] = useState<number>(0);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setIsTextCopied(true);
    setCopyTextIndex(index);

    setTimeout(() => {
      setIsTextCopied(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col justify-between   items-center   min-h-screen w-full">
      <div className="text-white w-full px-4  py-6  flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#9747ff] to-[#7f1fff]">
        <div className="relative flex flex-col mx-auto items-center  max-w-[1280px] ">
          <h1 className="text-3xl md:text-4xl font-semibold">
            Superbridge Dashboard
          </h1>
          <p className="text-sm text-center sm:text-base max-w-[960px] sm:px-5 md:font-medium font-matterLight mb-6 mt-4 sm:mt-2">
            Track all your bridge transaction limits for all supported tokens
            across your App chain and connected chains.
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
                    <button
                      onClick={fetchLimits}
                      disabled={chains.length === 0}
                      className="relative sm:py-2 hover:bg-gray-900  sm:px-[50px] py-2  sm:rounded-lg rounded-md bg-black text-white  text-sm sm:text-base disabled:bg-[#98a2b3] w-full"
                    >
                      Fetch Limits
                    </button>
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
      <section className=" gap-6 bg-[#F9FAFB]  flex-1 justify-center flex items-center   w-full">
        {!isFetchingLimits ? (
          <div className="flex flex-wrap   gap-3 p-2  w-full    justify-center md:p-7">
            {Object.keys(fetchedResults).length > 0 ? (
              Object.keys(fetchedResults).map((token: any, index) => (
                <div
                  key={index}
                  className="  rounded-lg bg-white  w-full md:w-auto flex flex-col items-center p-2 md:p-10 gap-10 "
                >
                  <div className="flex flex-col gap-1 items-center">
                    <h1 className=" text-[#344054] text-xl sm:text-[28px] font-semibold flex items-center">
                      {token}
                    </h1>
                    <div className="flex flex-col gap-3">
                      <div className="md:flex  md:gap-3 flex gap-2 text-nowrap  items-center ">
                        <p className="font-bold">Owner :</p>
                        <div className="flex   gap-1 items-center">
                          <p className="text-gray-700">
                            {/* {tokenOwner[token] || "N/A"} */}
                            {tokenOwner[token].slice(0, 6) +
                              "..." +
                              tokenOwner[token].slice(-4)}
                          </p>
                          {isTextCopied && copyTextIndex === index ? (
                            <div className="cursor-pointer">
                              <div className="flex items-center font-normal">
                                <svg
                                  width="17"
                                  height="18"
                                  viewBox="0 0 22 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  role="img"
                                  className="mx-1"
                                >
                                  <g
                                    clip-path="url(#copied_svg__a)"
                                    stroke="#039855"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  >
                                    <path d="M19.552 9.154V10a9.09 9.09 0 1 1-5.391-8.31"></path>
                                    <path d="m20.461 1.818-10 10-2.727-2.727"></path>
                                  </g>
                                  <defs>
                                    <clipPath id="copied_svg__a">
                                      <path
                                        fill="#fff"
                                        transform="translate(.46)"
                                        d="M0 0h20.909v20H0z"
                                      ></path>
                                    </clipPath>
                                  </defs>
                                </svg>
                                <span className="text-socket-secondary text-sm hidden md:inline-block">
                                  Copied
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() =>
                                copyToClipboard(tokenOwner[token], index)
                              }
                              className="cursor-pointer"
                            >
                              <svg
                                width="17"
                                height="18"
                                viewBox="0 0 25 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                role="img"
                                className="mx-1 fill-[#717d8a] hover:fill-[#7f1fff]"
                              >
                                <path d="M4.46 2a2 2 0 0 0-2 2v13a1 1 0 0 0 2 0V4h13a1 1 0 0 0 0-2h-13Zm4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-12Zm0 2h12v12h-12V8Z"></path>
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" flex flex-wrap items-center justify-center gap-3 ">
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
              <div className="h-full text-black items-center justify-center   w-full flex-1 ">
                <Empty
                  rootClassName="text-red-300"
                  description=""
                  className="text-red-400"
                />
                <p className="text-center text-[#667085] font-medium sm:font-semibold sm:mt-3 mt-2 sm:text-base text-sm">
                  No Limits To Show
                </p>
              </div>
            )}
          </div>
        ) : (
          // <div className=" flex ">
          //   <Spin tip="Loading" size="large" className="" />
          // </div>
          <Loading />
        )}
      </section>
    </div>
  );
};

export default Dashboard;
