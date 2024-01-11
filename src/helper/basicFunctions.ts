import toast from "react-hot-toast";

export function convertTimestampToIndianDateTime(timestamp: number): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedDateTime: string = new Intl.DateTimeFormat(
    "en-IN",
    options
  ).format(timestamp * 1000);

  return formattedDateTime;
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
