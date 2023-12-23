import { ChainSlug, Tokens } from "@socket.tech/socket-plugs";

type RpcEnumType = {
  [key: number]: string;
};

export const RpcEnum: RpcEnumType = {
  42161: "https://rpc.ankr.com/arbitrum",
  421613: "https://arbitrum-goerli.public.blastapi.io",
  421614: "https://sepolia-rollup.arbitrum.io/rpc",
  1: "https://rpc.ankr.com/eth",
  10: "https://rpc.ankr.com/optimism",
  420: "https://endpoints.omniatech.io/v1/op/goerli/public",
  2999: "https://mainnet.bityuan.com/eth",
  957: "https://rpc.lyra.finance",
  8453: "https://rpc.ankr.com/base",
  34443: "https://mainnet.mode.network",
  919: "https://sepolia.mode.network",
  647: "https://rpc.toronto.sx.technology",
  80001: "https://rpc-mumbai.maticvigil.com",
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
