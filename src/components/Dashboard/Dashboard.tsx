import {
  ChainSlug,
  DeploymentMode,
  Project,
  getSuperBridgeAddresses,
  Tokens,
  ProjectAddresses,
} from "@socket.tech/socket-plugs";
import { ChainId } from "@socket.tech/dl-core";

import { Button, Select, Spin } from "antd";
import { ethers } from "ethers";
import { useState } from "react";
import { contractABI as nonAppChain } from "../../contracts/ContractAbi";
import { appChain } from "../../contracts/AppChain";
import { RpcEnum, tokenDecimals } from "../../constants/consts";
// import fetchEnumDefinitions from "../../helper/enum-service";
import DetailsCard from "../DetailCard/DetailsCard";

const Dashboard = () => {
  const [selectedDeploymentMode, setSelectedDeploymentMode] =
    useState<DeploymentMode>(DeploymentMode.PROD);
  const [selectedChain, setSelectedChain] = useState<any>();

  const [fetchedResults, setFetchedResults] = useState<any>({});
  const [selectedProject, setSelectedProject] = useState<Project>();
  const [isFetchingLimits, setIsFetchingResults] = useState(false);
  const [chains, setChains] = useState([]) as any;
  const [selectedChainsDetails, setSelectedChainsDetails] = useState<any>();
  const handleModeChange = (e: any) => {
    const mode = e;
    setSelectedDeploymentMode(mode);
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

  const getChains = async () => {
    // console.log(selectedDeploymentMode);
    // console.log(selectedProject);

    if (!selectedDeploymentMode || !selectedProject)
      return alert("Select All Fields");

    const addresses = await getSuperBridgeAddresses(
      selectedDeploymentMode || DeploymentMode.PROD,
      (selectedProject as Project) || Project.AEVO
    );

    setChains(() => {
      return Object.keys(addresses).map((address: any) => {
        return {
          label: ChainSlug[address],
          value: ChainSlug[address],
        };
      });
    });

    setSelectedChainsDetails(addresses as ProjectAddresses);
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
  }: {
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
      // console.log(
      //   rpcUrl,
      //   tokenDecimal,
      //   functionToCall,
      //   contractAddress,
      //   connectorAddressList,
      //   token,
      //   contractABI
      // );

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
          // console.log(functionToCall, currentConnector[curr]);

          // return {
          //   paramsForLockOrMint: "getLockLimitParams",
          //   paramsForUnlockOrBurn: "getUnlockLimitParams",
          //   getCurrentLockOrMintLimit: "getCurrentLockLimit",
          //   getCurrentBurnOrUnlockLimit: "getCurrentUnlockLimit",
          // };
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
                // console.log("index", index);

                if (index === 0) {
                  // const date = new Date(Number(value) * 1000);
                  obj["lastUpdateTimestamp"] = Number(value);
                } else if (index === 1) {
                  obj["ratePerSecond"] = ethers.formatUnits(
                    value,
                    tokenDecimal
                  );
                } else if (index === 2) {
                  const maxLimit =
                    BigInt(value) > maxValue ? value : BigInt(value);
                  obj["maxLimit"] = ethers.formatUnits(maxLimit, tokenDecimal);
                } else if (index === 3) {
                  const lastUpdateLimit =
                    BigInt(value) > maxValue ? value : BigInt(value);
                  obj["lastUpdateLimit"] = ethers.formatUnits(
                    lastUpdateLimit,
                    tokenDecimal
                  );
                }
              });

              // const currentLimit = calculateLimit(obj);
              const currentLimitValue =
                BigInt(currentLimit) > maxValue
                  ? currentLimit
                  : BigInt(currentLimit);

              obj["currentLimit"] = ethers.formatUnits(
                currentLimitValue,
                tokenDecimal
              );

              return obj;
            } catch (error) {
              console.log("Error in Result construct", error);
            }
          };

          console.log(
            "resultParamsForLockOrMint",
            functionToCall.paramsForLockOrMint,
            "RPC",
            rpcUrl
          );
          console.log(
            "resultParamsForUnlockOrBurn",
            functionToCall.paramsForUnlockOrBurn
          );
          console.log(
            "getCurrentLockOrMintLimit",
            functionToCall.getCurrentLockOrMintLimit
          );

          console.log(
            "getCurrentBurnOrUnlockLimit",
            functionToCall.getCurrentBurnOrUnlockLimit
          );

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

          console.log("1", resultParamsForLockOrMint);
          console.log("2", resultParamsForUnlockOrBurn);
          console.log("3", getCurrentLockOrMintLimit);
          console.log("4", getCurrentBurnOrUnlockLimit);

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

          console.log("LockOrMint", lockOrMintLimitObject);
          console.log("UnlockOrBurn", unlockOrBurnLimitObject);

          // console.log("Result:", result);
          const obj = {
            token,
            source: selectedChain,
            DestToken: ChainId[connector as any],
            isAppChain,
            connectorType: curr,
            connectorAddr: currentConnector[curr],
            Result: {
              LockOrMint: lockOrMintLimitObject,
              UnlockOrBurn: unlockOrBurnLimitObject,
            },
          };

          connectorsResultArr.push(obj);
        }
      }
      console.log("===");

      collect.push(...connectorsResultArr);
    } catch (error) {
      console.error("Error calling contract function:", error);
    } finally {
      setIsFetchingResults(false);
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

  const fetchLimits = async () => {
    // console.log(selectedChainsDetails);

    const currentChain = ChainSlug[selectedChain as any];

    if (!selectedChainsDetails) return;

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

    // console.log(currentChainData);

    const whichFunctionToRun = (isAppChain: boolean) => {
      if (!isAppChain) {
        // return "getLockLimitParams";

        return {
          paramsForLockOrMint: "getLockLimitParams",
          paramsForUnlockOrBurn: "getUnlockLimitParams",
          getCurrentLockOrMintLimit: "getCurrentLockLimit",
          getCurrentBurnOrUnlockLimit: "getCurrentUnlockLimit",
        };
      } else {
        // return "getMintLimitParams";

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

    // console.log("curr", currentChainData);

    for (const token in currentChainData) {
      // console.log(token);

      const currentDetails = currentChainData[token];
      const rpcUrl = RpcEnum[Number(ChainSlug[selectedChain])];
      const tokenDecimal = tokenDecimals[token as Tokens];
      const functionToCall = whichFunctionToRun(currentDetails?.isAppChain);
      const connectorAddressList = currentDetails.connectors;
      // console.log("connectors", connectorAddressList);

      const contractAddress = whichContractAddressToUse(
        currentDetails?.isAppChain
      );
      const contractABI = currentDetails?.isAppChain ? appChain : nonAppChain;
      await callContractFunction({
        connectorAddressList,
        contractAddress: currentDetails[contractAddress],
        functionToCall,
        rpcUrl,
        tokenDecimal,
        token,
        contractABI,
        isAppChain: currentDetails?.isAppChain,
      });
    }

    // for (const key in collect) {
    //   const currentArr = collect[key];
    // }
    // console.log("CHECK", collect);

    let obj: any = {};

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

  // console.log("Fetched", fetchedResults);

  return (
    <div className="flex flex-col bg-gray-100 items-center pt-10 px-4 min-h-screen w-full">
      <div>
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      </div>
      <div className="flex flex-col items-center  h-[50%] mt-10">
        <div className=" flex flex-col items-center  justify-between h-[30%] gap-10  ">
          <div className=" flex gap-2  items-end">
            <div className="w-[10rem] ">
              <h1>Select mode</h1>
              <Select
                className="w-full"
                defaultValue={DeploymentMode.PROD}
                // style={{ width: 120 }}
                onChange={handleModeChange}
                options={allDeploymentModes}
              />
            </div>
            <div className="  w-[10rem]">
              <h1>Select Project</h1>
              <Select
                className="w-full"
                showSearch
                placeholder="Select a person"
                optionFilterProp="children"
                // defaultValue={Project.AEVO}
                onChange={handleProjectChange}
                onSearch={onSearch}
                filterOption={filterOption}
                options={allProjects}
              />
            </div>
            <div className="h-full flex flex-col  items-end justify-end">
              <Button onClick={getChains}>Get Chain</Button>
            </div>
          </div>
          {chains.length > 0 && (
            <div className="w-full flex gap-3  items-end">
              <div className="  w-full">
                <h1>Select Chain</h1>
                <Select
                  placeholder="Select a Chain"
                  // defaultValue={chains[0]?.value}
                  className=" w-full"
                  // style={{ width: 120 }}
                  onChange={(e) => {
                    setSelectedChain(e);
                  }}
                  options={chains}
                />
              </div>

              <div className="h-full flex  items-end">
                <Button disabled={chains.length === 0} onClick={fetchLimits}>
                  Fetch Limits
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <section className=" gap-6 flex-1 justify-center flex items-center  w-full">
        {!isFetchingLimits ? (
          <div className="flex flex-wrap gap-3  p-10">
            {fetchedResults &&
              Object.keys(fetchedResults).map((token: any, index) => (
                <div
                  key={index}
                  className="bg-blue-300 rounded-lg flex flex-col items-center p-10 gap-10 "
                >
                  <p>{token}</p>
                  <div className="  flex flex-wrap gap-3 ">
                    {fetchedResults[token]?.map((item: any, index: any) => (
                      <DetailsCard key={index} details={item} />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="">
            <Spin tip="Loading" size="large" className="" />
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
