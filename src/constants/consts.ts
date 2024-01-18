import { Tokens } from "@socket.tech/socket-plugs";

type RpcEnumType = {
  [key: number]: string;
};

// Public RPC endpoints
export const RpcEnum: RpcEnumType = {
  42161: "https://rpc.ankr.com/arbitrum",
  421613: "https://arbitrum-goerli.public.blastapi.io",
  421614: "https://sepolia-rollup.arbitrum.io/rpc",
  1: "https://rpc.ankr.com/eth",
  10: "https://rpc.ankr.com/optimism",
  420: "https://endpoints.omniatech.io/v1/op/goerli/public",
  2999: import.meta.env.VITE_APP_AEVO_RPC_URL as string,
  957: "https://rpc.lyra.finance",
  8453: "https://rpc.ankr.com/base",
  34443: "https://mainnet.mode.network",
  919: "https://sepolia.mode.network",
  647: "https://rpc.toronto.sx.technology",
  80001: "https://rpc-mumbai.maticvigil.com",
};

// Aevo Testnet	11155112	https://explorer-testnet.aevo.xyz/	https://l2-aevo-testnet-k1zx5a2ajj.t.conduit.xyz
// Aevo	2999	https://explorer.aevo.xyz/	https://l2-aevo-mainnet-prod-0.t.conduit.xyz
// Mode testnet	919	sepolia.explorer.mode.network	sepolia.mode.network
// Mode
// Lyra testnet	901	https://explorerl2new-prod-testnet-0eakp60405.t.conduit.xyz	https://l2-prod-testnet-0eakp60405.t.conduit.xyz
// Lyra	957	https://explorer.lyra.finance/	https://rpc.lyra.finance
// Ancient8 Testnet V2	28122024	https://scanv2-testnet.ancient8.gg	https://rpcv2-testnet.ancient8.gg/	https://bridgev2-testnet.ancient8.gg/
// Ancient8
// viction testnet	89	https://testnet.vicscan.xyz/	https://rpc-testnet.viction.xyz
// Parallel		https://parallel.subscan.io/
// SX testnet	647	https://explorer.toronto.sx.technology/	https://rpc.toronto.sx.technology/
// Hook testnet	46658378	https://hook-stylus-testnet.explorer.caldera.xyz/	https://hook-stylus-testnet.rpc.caldera.xyz/http	https://hook-stylus-testnet.calderabridge.xyz/
// base	8453	https://basescan.org/
// polygon mumbai		https://mumbai.polygonscan.com/

export const chainExplorerEnum: { [key: number]: string } = {
  11155112: "https://explorer-testnet.aevo.xyz/tx",
  2999: "https://explorer.aevo.xyz/tx",
  919: "https://sepolia.explorer.mode.network/tx",
  901: "https://explorerl2new-prod-testnet-0eakp60405.t.conduit.xyz/tx",
  957: "https://explorer.lyra.finance/tx",
  28122024: "https://scanv2-testnet.ancient8.gg/tx",
  89: "https://testnet.vicscan.xyz/tx",
  647: "https://explorer.toronto.sx.technology/tx",
  46658378: "https://hook-stylus-testnet.explorer.caldera.xyz/tx",
  8453: "https://basescan.org/tx",
  80001: "https://mumbai.polygonscan.com/tx",
  11155111: "https://sepolia.etherscan.io/tx",
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
