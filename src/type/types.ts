interface LockOrMintUnlockOrBurn {
  lastUpdateTimestamp: number;
  ratePerSecond: number;
  maxLimit: number;
  lastUpdateLimit: number;
  currentLimit: number;
}

interface Result {
  LockOrMint: LockOrMintUnlockOrBurn;
  UnlockOrBurn: LockOrMintUnlockOrBurn;
}

export interface IDetails {
  token: string;
  source: string;
  DestToken: string;
  isAppChain: boolean;
  connectorType: string;
  connectorAddr: string;
  contractAddress: string;
  Result: Result;
}

export interface MintLockOrBurnUnlockInfo {
  mintLockOrBurnUnlock: string;
  maxLimit: number;
  ratePerSecond: number;
}

export interface TokenInfo {
  token: string;
  isAppChain: boolean;
  source: string;
  DestToken: string;

  connectorType: string;
  connectorAddr: string;
  contractAddress: string;
  Result: Result;
}

export interface TokenData {
  [token: string]: TokenInfo[];
}

export interface DynamicTokenAddresses {
  [key: string]: string;
}

export interface Chains {
  label: string;
  value: string;
}

export interface MintLockOrBurnUnlockInfo {
  mintLockOrBurnUnlock: string;
  maxLimit: number;
  ratePerSecond: number;
}

export interface UpdateInfo {
  lastUpdateTimestamp: number;
  ratePerSecond: number;
  maxLimit: number;
  lastUpdateLimit: number;
  currentLimit: number;
}
