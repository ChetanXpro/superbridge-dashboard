export const AppChainABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "token_",
        type: "address",
      },
      {
        internalType: "address",
        name: "exchangeRate_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AmountOutsideLimit",
    type: "error",
  },
  {
    inputs: [],
    name: "ConnectorUnavailable",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidPoolId",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidTokenAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroAmount",
    type: "error",
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
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
    ],
    name: "ConnectorPoolIdUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "exchangeRate",
        type: "address",
      },
    ],
    name: "ExchangeRateUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "isMint",
            type: "bool",
          },
          {
            internalType: "address",
            name: "connector",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "maxLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "ratePerSecond",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct Controller.UpdateLimitParams[]",
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
        name: "mintAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "pendingAmount",
        type: "uint256",
      },
    ],
    name: "PendingTokensMinted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "connecter",
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
        name: "mintAmount",
        type: "uint256",
      },
    ],
    name: "TokensMinted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "connecter",
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
        name: "withdrawer",
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
        name: "burnAmount",
        type: "uint256",
      },
    ],
    name: "TokensWithdrawn",
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
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "connectorPendingMints",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "connectorPoolIds",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "exchangeRate__",
    outputs: [
      {
        internalType: "contract IExchangeRate",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "connector_",
        type: "address",
      },
    ],
    name: "getBurnLimitParams",
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
          {
            internalType: "uint256",
            name: "maxLimit",
            type: "uint256",
          },
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
      {
        internalType: "address",
        name: "connector_",
        type: "address",
      },
    ],
    name: "getCurrentBurnLimit",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "connector_",
        type: "address",
      },
    ],
    name: "getCurrentMintLimit",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "connector_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "msgGasLimit_",
        type: "uint256",
      },
    ],
    name: "getMinFees",
    outputs: [
      {
        internalType: "uint256",
        name: "totalFees",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "connector_",
        type: "address",
      },
    ],
    name: "getMintLimitParams",
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
          {
            internalType: "uint256",
            name: "maxLimit",
            type: "uint256",
          },
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
      {
        internalType: "address",
        name: "receiver_",
        type: "address",
      },
      {
        internalType: "address",
        name: "connector_",
        type: "address",
      },
    ],
    name: "mintPendingFor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "pendingMints",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pendingOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "poolLockedAmounts",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "payload_",
        type: "bytes",
      },
    ],
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
    inputs: [
      {
        internalType: "address",
        name: "token_",
        type: "address",
      },
      {
        internalType: "address",
        name: "rescueTo_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount_",
        type: "uint256",
      },
    ],
    name: "rescueFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "token__",
    outputs: [
      {
        internalType: "contract IMintableERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalMinted",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "connectors",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "poolIds",
        type: "uint256[]",
      },
    ],
    name: "updateConnectorPoolId",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "exchangeRate_",
        type: "address",
      },
    ],
    name: "updateExchangeRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "isMint",
            type: "bool",
          },
          {
            internalType: "address",
            name: "connector",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "maxLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "ratePerSecond",
            type: "uint256",
          },
        ],
        internalType: "struct Controller.UpdateLimitParams[]",
        name: "updates_",
        type: "tuple[]",
      },
    ],
    name: "updateLimitParams",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "burnAmount_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "msgGasLimit_",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "connector_",
        type: "address",
      },
    ],
    name: "withdrawFromAppChain",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];
