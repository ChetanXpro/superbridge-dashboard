import toast from "react-hot-toast";
import { ethers } from "ethers";

export function convertTimestampToIndianDateTime(timestamp: number): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formatter = new Intl.DateTimeFormat("en-IN", options);
  const formattedDateTime: string = formatter.format(timestamp * 1000);

  const result: string = `${formattedDateTime} UTC`;

  return result;
}

export async function checkIfWalletConnected() {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length) {
        return accounts[0];
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    toast.error(`Metamask not installed`, {
      duration: 5000,
      position: "top-right",
    });
  }
}

export const connectWallet = async () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts) {
        console.log(accounts[0]);
        return accounts[0];
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    toast.error(`Metamask not installed`, {
      duration: 5000,
      position: "top-right",
    });
  }
};

export async function checkChainId() {
  try {
    let userProvider = new ethers.BrowserProvider(window.ethereum);
    let objectNetwork = await userProvider.getNetwork();
    // returns a bigint
    let chainId = parseInt(objectNetwork.chainId.toString());
    const decimalChainId = parseInt(chainId.toString(), 16);
    // console.log("Decimal Chain ID:", decimalChainId);
    const hexChainId = decimalChainId.toString(16);
    // console.log("Hexadecimal Chain ID:", hexChainId);
    return hexChainId;
  } catch (error) {
    console.error("Error getting chain ID:", error);
    return null;
  }
}

export async function switchToChain(
  targetChainId: number,
  rpcUrl: string,
  name: string
) {
  try {
    const currentChainId = await checkChainId();
    console.log("Current Chain ID:", currentChainId);
    console.log("Target Chain ID:", targetChainId.toString());

    if (currentChainId !== targetChainId.toString()) {
      try {
        // Request MetaMask to switch to the specified chain
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${targetChainId.toString(16)}` }],
        });

        console.log(`Switched to chain ${targetChainId}`);
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            // make first latter capital of a string

            const capitalizedString =
              name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
            console.log("Capitalized String:", capitalizedString);

            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${targetChainId.toString(16)}`,
                  chainName: capitalizedString,
                  rpcUrls: [rpcUrl],
                },
              ],
            });
          } catch (addError) {
            // handle "add" error
            console.error("Error adding chain:", addError);
          }
        }
      }
    } else {
      console.log("Already on target chain");
    }
  } catch (error) {
    // Handle errors, such as the user rejecting the chain switch
    console.error("Error switching chain:", error);
  }
}

export const whichFunctionsToCall = (isAppChain: boolean) => {
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

export const whichContractToUse = (isAppChain: boolean) => {
  if (!isAppChain) {
    return "Vault";
  } else {
    return "Controller";
  }
};
