import { useState } from "react";
// const { ethers } = require("ethers");
import { BigNumberish, ethers } from "ethers";
import {
  getSuperBridgeAddresses,
  DeploymentMode,
  Project,
  ChainSlug,
} from "@socket.tech/socket-plugs";
import "./App.css";

function App() {
  const [selectedDeploymentMode, setSelectedDeploymentMode] =
    useState<DeploymentMode>(DeploymentMode.PROD);
  const [selectedProject, setSelectedProject] = useState<Project>(Project.AEVO);
  const [chains, setChains] = useState() as any;
  const [selectedChains, setSelectedChains] = useState();

  const get = async () => {
    console.log(selectedDeploymentMode);
    console.log(selectedProject);

    const addresses = await getSuperBridgeAddresses(
      selectedDeploymentMode || DeploymentMode.PROD,
      selectedProject || Project.AEVO
    );

    setChains(Object.keys(addresses));
    console.log(addresses);
  };

  const fetchLimit = async () => {
    const contractABI = [
      {
        inputs: [{ internalType: "address", name: "token_", type: "address" }],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      { inputs: [], name: "AmountOutsideLimit", type: "error" },
      { inputs: [], name: "ConnectorUnavailable", type: "error" },
      {
        anonymous: false,
        inputs: [
          {
            components: [
              { internalType: "bool", name: "isLock", type: "bool" },
              { internalType: "address", name: "connector", type: "address" },
              { internalType: "uint256", name: "maxLimit", type: "uint256" },
              {
                internalType: "uint256",
                name: "ratePerSecond",
                type: "uint256",
              },
            ],
            indexed: false,
            internalType: "struct Vault.UpdateLimitParams[]",
            name: "updates",
            type: "tuple[]",
          },
        ],
        name: "LimitParamsUpdated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "OwnershipTransferStarted",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "OwnershipTransferred",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "connector",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "receiver",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "unlockedAmount",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "pendingAmount",
            type: "uint256",
          },
        ],
        name: "PendingTokensTransferred",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "connector",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "depositor",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "receiver",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "depositAmount",
            type: "uint256",
          },
        ],
        name: "TokensDeposited",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "connector",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "receiver",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "pendingAmount",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "totalPendingAmount",
            type: "uint256",
          },
        ],
        name: "TokensPending",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "connector",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "receiver",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "unlockedAmount",
            type: "uint256",
          },
        ],
        name: "TokensUnlocked",
        type: "event",
      },
      {
        inputs: [],
        name: "acceptOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "", type: "address" }],
        name: "connectorPendingUnlocks",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "receiver_", type: "address" },
          { internalType: "uint256", name: "amount_", type: "uint256" },
          { internalType: "uint256", name: "msgGasLimit_", type: "uint256" },
          { internalType: "address", name: "connector_", type: "address" },
        ],
        name: "depositToAppChain",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "connector_", type: "address" },
        ],
        name: "getCurrentLockLimit",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "connector_", type: "address" },
        ],
        name: "getCurrentUnlockLimit",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "connector_", type: "address" },
        ],
        name: "getLockLimitParams",
        outputs: [
          {
            components: [
              {
                internalType: "uint256",
                name: "lastUpdateTimestamp",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "ratePerSecond",
                type: "uint256",
              },
              { internalType: "uint256", name: "maxLimit", type: "uint256" },
              {
                internalType: "uint256",
                name: "lastUpdateLimit",
                type: "uint256",
              },
            ],
            internalType: "struct Gauge.LimitParams",
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "connector_", type: "address" },
          { internalType: "uint256", name: "msgGasLimit_", type: "uint256" },
        ],
        name: "getMinFees",
        outputs: [
          { internalType: "uint256", name: "totalFees", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "connector_", type: "address" },
        ],
        name: "getUnlockLimitParams",
        outputs: [
          {
            components: [
              {
                internalType: "uint256",
                name: "lastUpdateTimestamp",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "ratePerSecond",
                type: "uint256",
              },
              { internalType: "uint256", name: "maxLimit", type: "uint256" },
              {
                internalType: "uint256",
                name: "lastUpdateLimit",
                type: "uint256",
              },
            ],
            internalType: "struct Gauge.LimitParams",
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "pendingOwner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "", type: "address" },
          { internalType: "address", name: "", type: "address" },
        ],
        name: "pendingUnlocks",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "bytes", name: "payload_", type: "bytes" }],
        name: "receiveInbound",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "token__",
        outputs: [
          { internalType: "contract ERC20", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "newOwner", type: "address" },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "receiver_", type: "address" },
          { internalType: "address", name: "connector_", type: "address" },
        ],
        name: "unlockPendingFor",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            components: [
              { internalType: "bool", name: "isLock", type: "bool" },
              { internalType: "address", name: "connector", type: "address" },
              { internalType: "uint256", name: "maxLimit", type: "uint256" },
              {
                internalType: "uint256",
                name: "ratePerSecond",
                type: "uint256",
              },
            ],
            internalType: "struct Vault.UpdateLimitParams[]",
            name: "updates_",
            type: "tuple[]",
          },
        ],
        name: "updateLimitParams",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    const provider = new ethers.JsonRpcProvider(
      "https://rpc.ankr.com/optimism"
    );

    const contractAddress = "0xFff4A34925301d231ddF42B871c3b199c1E80584";

    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );

    // function formatUnits(
    //   value: BigNumberish,
    //   decimals: string | BigNumberish = 0,
    //   maxDecimalDigits?: number
    // ) {
    //   return ethers.FixedNumber..from(ethers.formatUnits(value, decimals))
    //     .round(maxDecimalDigits ?? ethers.BigNumber.from(decimals).toNumber())
    //     .toString();
    // }

    async function callContractFunction() {
      try {
        const result = await contract["getUnlockLimitParams"](
          "0x1812ff6bd726934f18159164e2927B34949B16a8"
        ); // Replace with the actual function name
        console.log("Result:", typeof result);

        for (const key in result) {
          const tokenDecimalPlaces = 18;

          // Example: Value in the raw integer form (without decimal places)
          const rawValue = ethers.parseUnits("123.456789", tokenDecimalPlaces);

          // Format the value to a human-readable format
          const formattedValue = ethers.formatUnits(
            rawValue,
            tokenDecimalPlaces
          );

          // console.log("Formatted Value:", formattedValue);
          console.log(ethers.formatUnits(result[key], tokenDecimalPlaces));
        }
        // ethers.formatUnits(value, decimals);
      } catch (error) {
        console.error("Error calling contract function:", error);
      }
    }
    await callContractFunction();
  };

  return (
    <>
      <div className="flex flex-col">
        <button onClick={get}>get</button>
        <select
          onChange={(e) => {
            setSelectedDeploymentMode(e.target.value as DeploymentMode);
          }}
          value={selectedDeploymentMode}
          name=""
          id=""
        >
          {Object.values(DeploymentMode).map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => {
            setSelectedProject(e.target.value as Project);
          }}
          value={selectedProject}
          name=""
          id=""
        >
          {Object.values(Project).map((project) => (
            <option key={project} value={project}>
              {project}
            </option>
          ))}
        </select>

        {chains && (
          <select name="" id="">
            {Object.values(chains).map((chain: any) => (
              <option key={chain} value={chain}>
                {ChainSlug[chain]}
              </option>
            ))}
          </select>
        )}

        <button onClick={fetchLimit}>Fetch limit</button>
      </div>
    </>
  );
}

export default App;
