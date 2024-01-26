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
