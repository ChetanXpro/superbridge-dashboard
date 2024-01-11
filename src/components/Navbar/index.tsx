import React, { useEffect } from "react";
import {
  checkIfWalletConnected,
  connectWallet,
} from "../../helper/basicFunctions";
import { Button } from "antd";
import { useAtom } from "jotai";
import { userAddress } from "../../atoms/atoms";

const Navbar = () => {
  const [isWalletConnected, setIsWalletConnected] = React.useState(false);
  const [userAddr, setUserAddr] = useAtom(userAddress);
  useEffect(() => {
    checkIfWalletConnected().then((address) => {
      setIsWalletConnected(!!address);
      setUserAddr(address);
    });
  }, []);
  const handleWalletConnect = async () => {
    const address = await connectWallet();
    if (address) {
      setUserAddr(address);
      setIsWalletConnected(true);
      localStorage.setItem;
    }
  };

  const handleDisconnect = async () => {
    setIsWalletConnected(false);
    setUserAddr("");
  };
  return (
    <div className="px-6 flex flex-row items-center  justify-between  w-full h-20 py-4 z-50 relative">
      <div className="font-bold flex items-center">
        <a className="flex items-center sm:mr-[60px]" href="/">
          <div className="mr-2 hidden ">
            <svg
              width="36"
              height="36"
              viewBox="0 0 38 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_401_9)">
                <rect width="37" height="37" rx="1" fill="#1c1d28"></rect>
                <g mask="url(#mask0_401_9)">
                  <path
                    d="M27.4923 36.999C18.4522 36.999 9.43654 36.9993 0.420887 36.9981C-0.0530799 36.998 0.00200002 37.0532 0.00195103 36.5807C0.000872926 24.5277 0.000872926 12.4746 0.00195103 0.421491C0.00200002 -0.0531513 -0.0530806 0.00200266 0.418681 0.00195361C12.4723 0.000874078 24.5258 0.000874078 36.5791 0.00195361C37.0533 0.00200266 36.998 -0.0531507 36.998 0.419234C36.9995 12.4724 36.9995 24.5255 36.998 36.5786C36.998 37.0533 37.0533 36.9978 36.5814 36.9981C33.5599 36.9998 30.5383 36.999 27.4923 36.999ZM9.45271 12.6639C9.26924 12.6938 9.08563 12.723 8.9023 12.7539C7.24321 13.0339 5.94476 13.8923 5.01643 15.2785C4.1814 16.5252 3.87027 17.9073 4.10975 19.4079C4.33924 20.8458 5.01315 22.0417 6.11495 22.9594C7.50911 24.1205 9.13237 24.5728 10.9337 24.2351C12.3511 23.9694 13.5342 23.2668 14.4187 22.1294C15.4938 20.7469 15.9206 19.1718 15.583 17.433C15.227 15.6003 14.2125 14.2331 12.5736 13.3428C11.617 12.8231 10.5845 12.614 9.45271 12.6639ZM29.8013 21.9275C29.5641 21.9784 29.3284 22.0588 29.0888 22.0754C27.8197 22.1632 26.7394 21.7723 25.9128 20.7714C25.2061 19.9158 24.9718 18.9223 25.161 17.8511C25.3409 16.8319 25.8737 16.0104 26.7753 15.4655C27.8832 14.7959 29.0376 14.7103 30.2144 15.2606C30.5702 15.4269 30.8911 15.667 31.2566 15.8906C31.6438 15.5009 32.0452 15.0957 32.4475 14.6915C32.795 14.3427 32.795 14.3437 32.4191 14.0345C31.0205 12.8843 29.4298 12.4479 27.6455 12.7626C26.4865 12.9668 25.4885 13.5009 24.6422 14.3151C24.0616 14.8736 23.6197 15.5271 23.3086 16.2749C22.8656 17.3392 22.7485 18.4423 22.9612 19.5631C23.2226 20.9407 23.8972 22.0906 24.9895 22.9919C25.9685 23.7994 27.09 24.2465 28.3434 24.3318C29.4969 24.4102 30.5888 24.1422 31.5875 23.5545C31.9417 23.346 32.2637 23.081 32.5936 22.8323C32.6847 22.7636 32.8091 22.674 32.671 22.5345C32.1946 22.0542 31.7174 21.5751 31.2797 21.1352C30.774 21.4083 30.306 21.6608 29.8013 21.9275Z"
                    fill="#ffffff"
                  ></path>
                  <path
                    d="M6.90738 20.5591C6.42097 19.7753 6.17781 18.9584 6.31066 18.0398C6.48728 16.8184 7.10223 15.9013 8.17899 15.3183C9.35626 14.6807 10.8826 14.7894 11.9607 15.5862C12.7634 16.1794 13.2798 16.9694 13.4062 17.9568C13.5472 19.0599 13.2922 20.07 12.512 20.9159C11.7035 21.7926 10.6984 22.1653 9.53312 22.0741C8.54573 21.9967 7.71566 21.5678 7.08968 20.7792C7.03401 20.709 6.97261 20.6433 6.90738 20.5591Z"
                    fill="#ffffff"
                  ></path>
                </g>
              </g>
              <defs>
                <clipPath id="clip0_401_9">
                  <rect width="38" height="38" rx="1" fill="#1c1d28"></rect>
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="mr-2 inline-block">
            <svg
              width="36"
              height="36"
              viewBox="0 0 38 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_401_9)">
                <rect width="37" height="37" rx="1" fill="#fff"></rect>
                <g mask="url(#mask0_401_9)">
                  <path
                    d="M27.4923 36.999C18.4522 36.999 9.43654 36.9993 0.420887 36.9981C-0.0530799 36.998 0.00200002 37.0532 0.00195103 36.5807C0.000872926 24.5277 0.000872926 12.4746 0.00195103 0.421491C0.00200002 -0.0531513 -0.0530806 0.00200266 0.418681 0.00195361C12.4723 0.000874078 24.5258 0.000874078 36.5791 0.00195361C37.0533 0.00200266 36.998 -0.0531507 36.998 0.419234C36.9995 12.4724 36.9995 24.5255 36.998 36.5786C36.998 37.0533 37.0533 36.9978 36.5814 36.9981C33.5599 36.9998 30.5383 36.999 27.4923 36.999ZM9.45271 12.6639C9.26924 12.6938 9.08563 12.723 8.9023 12.7539C7.24321 13.0339 5.94476 13.8923 5.01643 15.2785C4.1814 16.5252 3.87027 17.9073 4.10975 19.4079C4.33924 20.8458 5.01315 22.0417 6.11495 22.9594C7.50911 24.1205 9.13237 24.5728 10.9337 24.2351C12.3511 23.9694 13.5342 23.2668 14.4187 22.1294C15.4938 20.7469 15.9206 19.1718 15.583 17.433C15.227 15.6003 14.2125 14.2331 12.5736 13.3428C11.617 12.8231 10.5845 12.614 9.45271 12.6639ZM29.8013 21.9275C29.5641 21.9784 29.3284 22.0588 29.0888 22.0754C27.8197 22.1632 26.7394 21.7723 25.9128 20.7714C25.2061 19.9158 24.9718 18.9223 25.161 17.8511C25.3409 16.8319 25.8737 16.0104 26.7753 15.4655C27.8832 14.7959 29.0376 14.7103 30.2144 15.2606C30.5702 15.4269 30.8911 15.667 31.2566 15.8906C31.6438 15.5009 32.0452 15.0957 32.4475 14.6915C32.795 14.3427 32.795 14.3437 32.4191 14.0345C31.0205 12.8843 29.4298 12.4479 27.6455 12.7626C26.4865 12.9668 25.4885 13.5009 24.6422 14.3151C24.0616 14.8736 23.6197 15.5271 23.3086 16.2749C22.8656 17.3392 22.7485 18.4423 22.9612 19.5631C23.2226 20.9407 23.8972 22.0906 24.9895 22.9919C25.9685 23.7994 27.09 24.2465 28.3434 24.3318C29.4969 24.4102 30.5888 24.1422 31.5875 23.5545C31.9417 23.346 32.2637 23.081 32.5936 22.8323C32.6847 22.7636 32.8091 22.674 32.671 22.5345C32.1946 22.0542 31.7174 21.5751 31.2797 21.1352C30.774 21.4083 30.306 21.6608 29.8013 21.9275Z"
                    fill="#7A4AFF"
                  ></path>
                  <path
                    d="M6.90738 20.5591C6.42097 19.7753 6.17781 18.9584 6.31066 18.0398C6.48728 16.8184 7.10223 15.9013 8.17899 15.3183C9.35626 14.6807 10.8826 14.7894 11.9607 15.5862C12.7634 16.1794 13.2798 16.9694 13.4062 17.9568C13.5472 19.0599 13.2922 20.07 12.512 20.9159C11.7035 21.7926 10.6984 22.1653 9.53312 22.0741C8.54573 21.9967 7.71566 21.5678 7.08968 20.7792C7.03401 20.709 6.97261 20.6433 6.90738 20.5591Z"
                    fill="#7A4AFF"
                  ></path>
                </g>
              </g>
              <defs>
                <clipPath id="clip0_401_9">
                  <rect width="38" height="38" rx="1" fill="#fff"></rect>
                </clipPath>
              </defs>
            </svg>
          </div>
          <span className="text-base text-[#7A4AFF]  font-semibold sm:text-[28px]">
            Socket
          </span>
        </a>
      </div>
      <div className="flex">
        {isWalletConnected ? (
          <div className="text-center flex  justify-center  gap-2">
            <div className="flex font-semibold items-center text-sm   md:text-base bg-gray-300 text-gray-700   rounded-md md:rounded-lg  px-3 cursor-pointer">
              0x1cF1...7961
            </div>
            <button className="bg-red-500 flex gap-2 items-center text-white   md:px-2 md:py-[11px] rounded-[4px]  ">
              <svg
                fill="none"
                height="16"
                viewBox="0 0 18 16"
                width="18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.67834 15.5908H9.99963C11.5514 15.5908 12.399 14.7432 12.399 13.1777V10.2656H10.6354V12.9863C10.6354 13.5332 10.3688 13.8271 9.78772 13.8271H2.89026C2.3092 13.8271 2.0426 13.5332 2.0426 12.9863V3.15625C2.0426 2.60254 2.3092 2.30859 2.89026 2.30859H9.78772C10.3688 2.30859 10.6354 2.60254 10.6354 3.15625V5.89746H12.399V2.95801C12.399 1.39941 11.5514 0.544922 9.99963 0.544922H2.67834C1.12659 0.544922 0.278931 1.39941 0.278931 2.95801V13.1777C0.278931 14.7432 1.12659 15.5908 2.67834 15.5908ZM7.43616 8.85059H14.0875L15.0924 8.78906L14.566 9.14453L13.6842 9.96484C13.5406 10.1016 13.4586 10.2861 13.4586 10.4844C13.4586 10.8398 13.7321 11.168 14.1217 11.168C14.3199 11.168 14.4635 11.0928 14.6002 10.9561L16.7809 8.68652C16.986 8.48145 17.0543 8.27637 17.0543 8.06445C17.0543 7.85254 16.986 7.64746 16.7809 7.43555L14.6002 5.17285C14.4635 5.03613 14.3199 4.9541 14.1217 4.9541C13.7321 4.9541 13.4586 5.27539 13.4586 5.6377C13.4586 5.83594 13.5406 6.02734 13.6842 6.15723L14.566 6.98438L15.0924 7.33984L14.0875 7.27148H7.43616C7.01917 7.27148 6.65686 7.62012 6.65686 8.06445C6.65686 8.50195 7.01917 8.85059 7.43616 8.85059Z"
                  fill="currentColor"
                ></path>
              </svg>{" "}
              Disconnect
            </button>
          </div>
        ) : (
          <Button size="large" onClick={handleWalletConnect}>
            Connect
          </Button>
        )}

        {/* <button className="rounded-lg bg-[#F2F4F7]  px-2 py-2 md:px-2.5 md:py-1.5 ml-3 sm:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="text-black dark:text-white"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button> */}
      </div>
    </div>
  );
};

export default Navbar;
