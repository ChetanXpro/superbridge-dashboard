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
import { useContractWrite, UseContractWriteConfig } from "wagmi";
import { Button, Empty, Select, Spin } from "antd";
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
      const signer = provider.getSigner();

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
                  ).toFixed(2);
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

          // console.log(
          //   "resultParamsForLockOrMint",
          //   functionToCall.paramsForLockOrMint,
          //   "RPC",
          //   rpcUrl
          // );
          // console.log(
          //   "resultParamsForUnlockOrBurn",
          //   functionToCall.paramsForUnlockOrBurn
          // );
          // console.log(
          //   "getCurrentLockOrMintLimit",
          //   functionToCall.getCurrentLockOrMintLimit
          // );

          // console.log(
          //   "getCurrentBurnOrUnlockLimit",
          //   functionToCall.getCurrentBurnOrUnlockLimit
          // );

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

    for (const token in currentChainData) {
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

  return (
    <div className="flex flex-col justify-between  items-center   min-h-screen w-full">
      <div className="text-white w-full px-4 py-6 sm:py-[62px] flex flex-col items-center justify-center text-center bg-[#7f1fff]">
        <div className="relative flex flex-col mx-auto items-center max-w-[1280px]">
          <h1 className="text-3xl md:text-4xl font-semibold">
            Socket Explorer
          </h1>
          <p className="text-sm text-center sm:text-base max-w-[960px] sm:px-5 md:font-medium mb-6 mt-4 sm:mt-2">
            Track all your bridge transactions across Ethereum, Optimism,
            Arbitrum, Polygon, Base, zkSync Era, Polygon zkEVM, BNB Chain,
            Avalanche, Gnosis Chain, Zora, Fantom, and Aurora.
          </p>
          <div className="w-full mt-2 rounded-lg dark:border-[1px] border dark:border-tx-page border-opacity-50">
            <div className="flex flex-row rounded-lg overflow-hidden">
              <input
                type="text"
                className="w-full py-3 px-4 text-sm md:text-base bg-socket-base overflow-visible focus:outline-none text-socket-base rounded-none"
                placeholder="Search by transaction hash or address"
                value=""
              />
              <button className="flex items-center justify-center bg- text-black font-medium px-3 bg-socket-base">
                <svg
                  viewBox="0 0 31 31"
                  fill="#717D8A"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  stroke="#717D8A"
                  className="hover:fill-search-hover hover:stroke-search-hover h-5 md:h-6 undefined"
                >
                  <path d="m26.861 29.878.354.354.354-.354 1.81-1.81.353-.353-.353-.354-8.017-8.016A11.313 11.313 0 0 0 23.82 12.3C23.82 6.022 18.718.92 12.44.92 6.163.92 1.06 6.023 1.06 12.3c0 6.277 5.103 11.38 11.38 11.38 2.333 0 4.498-.713 6.302-1.92l8.12 8.118ZM12.441 3.2a9.09 9.09 0 0 1 9.1 9.1 9.09 9.09 0 0 1-9.1 9.1 9.09 9.09 0 0 1-9.1-9.1 9.09 9.09 0 0 1 9.1-9.1Z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <section className=" gap-6 bg-white  flex-1 justify-center flex items-center   w-full">
        {!isFetchingLimits ? (
          <div className="flex flex-wrap gap-3 p-2  w-full    justify-center md:p-10">
            {Object.keys(fetchedResults).length > 0 ? (
              Object.keys(fetchedResults).map((token: any, index) => (
                <div
                  key={index}
                  className="bg-blue-300  rounded-lg w-full md:w-auto flex flex-col items-center p-2 md:p-10 gap-10 "
                >
                  <h1 className="text-2xl font-bold">{token}</h1>
                  <div className="  flex flex-wrap   w-full justify-center gap-3 ">
                    {fetchedResults[token]?.map((item: any, index: any) => (
                      <DetailsCard key={index} details={item} />
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
