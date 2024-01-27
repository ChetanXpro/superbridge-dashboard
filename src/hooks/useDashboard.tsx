/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChainSlug,
  DeploymentMode,
  Project,
  ProjectAddresses,
  Tokens,
  getSuperBridgeAddresses,
} from "@socket.tech/socket-plugs";
import { useState } from "react";
import { RpcEnum, tokenDecimals } from "../constants/consts";
import { ethers } from "ethers";
import { ChainId } from "@socket.tech/dl-core";
import toast from "react-hot-toast";
import { NonAppChainABI } from "../contracts/NonAppChain";
import { AppChainABI } from "../contracts/AppChain";
import {
  whichContractToUse,
  whichFunctionsToCall,
} from "../helper/basicFunctions";
import { Chains, DynamicTokenAddresses, TokenData } from "../type/types";
const useDashboard = () => {
  const [selectedDeploymentMode, setSelectedDeploymentMode] =
    useState<DeploymentMode>(DeploymentMode.PROD);
  const [tokenOwner, setTokenOwner] = useState<DynamicTokenAddresses>({});

  const [selectedChain, setSelectedChain] = useState<string | undefined>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copyTextIndex, setCopyTextIndex] = useState<number>(0);

  const [fetchedResults, setFetchedResults] = useState<TokenData>({});
  const [selectedProject, setSelectedProject] = useState<Project>();
  const [isFetchingLimits, setIsFetchingResults] = useState(false);
  const [chains, setChains] = useState<Chains[]>([]);

  const [selectedChainsDetails, setSelectedChainsDetails] = useState<any>();

  console.log("Selected Chains Details", selectedChainsDetails);

  const [changeRpcUrl, setChangeRpcUrl] = useState<boolean>(false);
  const [isTextCopied, setIsTextCopied] = useState<boolean>(false);
  const [rpcUrl, setRpcUrl] = useState<string>(
    RpcEnum[Number(ChainSlug[Number(selectedChain)])]
  );

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "")?.toLowerCase().includes(input?.toLowerCase());

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

  const collect: any = [];

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
    connectorAddressList: {
      [key: string]: {
        [key: string]: string;
      };
    };
    token: string;
    contractABI: any;
    isAppChain: boolean;
  }) {
    try {
      console.log("Connector Address List", connectorAddressList);

      const provider = new ethers.JsonRpcProvider(rpcUrl);

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );

      const connectorsResultArr = [];

      for (const connector in connectorAddressList) {
        const currentConnector = connectorAddressList[connector];

        for (const curr in currentConnector) {
          const constructResult = (
            tokenDecimal: number,
            result: any,
            currentLimit: string
          ) => {
            // console.log("DATA TO CONTRUCT", data);

            try {
              const maxValue = BigInt(Number.MAX_SAFE_INTEGER);
              const obj: {
                lastUpdateTimestamp?: number;
                ratePerSecond?: string;
                maxLimit?: string;
                lastUpdateLimit?: string;
                currentLimit?: string;
              } = {};
              Object.values(result).forEach((value: any, index: number) => {
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
            DestToken: ChainId[connector as keyof typeof ChainId],
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
    }
  }

  const handleProjectChange = (e: Project) => {
    // console.log(e);

    setSelectedProject(e);
    // getChains(selectedDeploymentMode, e);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setIsTextCopied(true);
    setCopyTextIndex(index);

    setTimeout(() => {
      setIsTextCopied(false);
    }, 2000);
  };

  const [isContractAddressCopied, setIsContractAddressCopied] = useState(false);
  const [contractAddressCopyIndex, setContractAddressCopyIndex] = useState(0);
  const copyContractAddrToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setIsContractAddressCopied(true);
    setContractAddressCopyIndex(index);

    setTimeout(() => {
      setIsContractAddressCopied(false);
    }, 2000);
  };

  const handleModeChange = (e: DeploymentMode) => {
    const mode = e;
    setSelectedDeploymentMode(mode);
    getChains(selectedProject!, e);
  };

  const getChains = async (project: string, mode: string) => {
    try {
      if (!selectedDeploymentMode) return alert("Select All Fields");

      if (selectedDeploymentMode && !project) return;

      setSelectedChain(undefined);
      setSelectedProject(project as Project);

      const addresses = await getSuperBridgeAddresses(
        (mode as DeploymentMode) || DeploymentMode.PROD,
        (project as Project) || Project.AEVO
      );

      setChains(() => {
        return Object.keys(addresses).map((address: string) => {
          return {
            label: ChainSlug[Number(address)],
            value: ChainSlug[Number(address)],
          };
        });
      });
      setSelectedChain(ChainSlug[Number(Object.keys(addresses)[0])]);

      setRpcUrl(
        RpcEnum[
          Number(
            ChainSlug[
              ChainSlug[
                Object.keys(addresses)[0] as any
              ] as keyof typeof ChainSlug
            ]
          )
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

  const fetchLimits = async () => {
    // console.log(selectedChainsDetails);

    const currentChain = ChainSlug[selectedChain as keyof typeof ChainSlug];

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

    const owners: DynamicTokenAddresses = {};

    const dummyData: any = {
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
    };

    for (const token in dummyData) {
      const currentDetails = dummyData[token];

      const tokenDecimal = tokenDecimals[token as Tokens];
      const functionToCall = whichFunctionsToCall(currentDetails?.isAppChain);
      const connectorAddressList = currentDetails.connectors;

      const contractAddress = whichContractToUse(currentDetails?.isAppChain);

      const contractABI = currentDetails?.isAppChain
        ? AppChainABI
        : NonAppChainABI;

      const provider = new ethers.JsonRpcProvider(rpcUrl);
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
        rpcUrl,
        tokenDecimal,
        token,
        contractABI,
        isAppChain: currentDetails?.isAppChain,
        // owner,
      });
    }

    setIsFetchingResults(false);
    const obj: TokenData = {};

    setTokenOwner(owners);
    console.log("Collect", collect);

    collect.forEach((element: any) => {
      if (obj[element?.token]) {
        obj[element.token].push(element);
      } else {
        obj[element?.token] = [];
        obj[element?.token].push(element);
      }
    });

    setFetchedResults(obj);
  };

  return {
    selectedDeploymentMode,
    setSelectedDeploymentMode,
    tokenOwner,
    setTokenOwner,
    selectedChain,
    setSelectedChain,
    fetchedResults,
    setFetchedResults,
    selectedProject,
    setSelectedProject,
    isFetchingLimits,
    setIsFetchingResults,
    chains,
    setChains,
    selectedChainsDetails,
    setSelectedChainsDetails,
    changeRpcUrl,
    setChangeRpcUrl,
    isTextCopied,
    setIsTextCopied,
    rpcUrl,

    setRpcUrl,
    allDeploymentModes,
    allProjects,
    callContractFunction,
    handleProjectChange,
    copyToClipboard,
    isModalOpen,
    setIsModalOpen,
    copyTextIndex,
    setCopyTextIndex,
    handleModeChange,
    getChains,
    filterOption,
    fetchLimits,
    isContractAddressCopied,
    setIsContractAddressCopied,
    contractAddressCopyIndex,
    setContractAddressCopyIndex,
    copyContractAddrToClipboard,
  };
};

export default useDashboard;
