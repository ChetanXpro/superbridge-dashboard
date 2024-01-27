import { Tokens } from "@socket.tech/socket-plugs";

type RpcEnumType = {
  [key: number]: string;
};

export const SECONDS_IN_DAY = 86400;
// Public RPC endpoints
export const RpcEnum: RpcEnumType = {
  42161: "https://rpc.ankr.com/arbitrum",
  421613: "https://arbitrum-goerli.public.blastapi.io",
  421614: "https://sepolia-rollup.arbitrum.io/rpc",
  1: "https://rpc.ankr.com/eth",
  10: "https://rpc.ankr.com/optimism",
  420: "https://endpoints.omniatech.io/v1/op/goerli/public",
  2999: "https://l2-aevo-mainnet-prod-0.t.conduit.xyz",
  957: "https://rpc.lyra.finance",
  8453: "https://rpc.ankr.com/base",
  34443: "https://mainnet.mode.network",
  919: "https://sepolia.mode.network",
  647: "https://rpc.toronto.sx.technology",
  80001: "https://rpc-mumbai.maticvigil.com",
};

export const chainExplorerEnum: { [key: number]: string } = {
  11155112: "https://explorer-testnet.aevo.xyz",
  2999: "https://explorer.aevo.xyz",
  919: "https://sepolia.explorer.mode.network",
  901: "https://explorerl2new-prod-testnet-0eakp60405.t.conduit.xyz",
  957: "https://explorer.lyra.finance",
  28122024: "https://scanv2-testnet.ancient8.gg",
  89: "https://testnet.vicscan.xyz",
  647: "https://explorer.toronto.sx.technology",
  46658378: "https://hook-stylus-testnet.explorer.caldera.xyz",
  8453: "https://basescan.org",
  80001: "https://mumbai.polygonscan.com",
  11155111: "https://sepolia.etherscan.io",
  10: "https://optimistic.etherscan.io",
};

export const tokenDecimals: { [key in Tokens]: number } = {
  [Tokens.Moon]: 18,
  [Tokens.USDC]: 6,
  [Tokens.WETH]: 18,
};

export const tokenName: { [key in Tokens]: string } = {
  [Tokens.Moon]: "Moon",
  [Tokens.USDC]: "USD coin",
  [Tokens.WETH]: "Wrapped Ether",
};

export const tokenSymbol: { [key in Tokens]: string } = {
  [Tokens.Moon]: "MOON",
  [Tokens.USDC]: "USDC",
  [Tokens.WETH]: "WETH",
};
