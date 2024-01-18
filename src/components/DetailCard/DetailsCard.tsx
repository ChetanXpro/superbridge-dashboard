import { Button, Divider } from "antd";
import { ChainId } from "@socket.tech/dl-core";

import {
  checkChainId,
  convertTimestampToIndianDateTime,
  switchToChain,
} from "../../helper/basicFunctions";
import { useState } from "react";
import LimitUpdateModal from "../LimitUpdateModal";
import { userAddress } from "../../atoms/atoms";
import { useAtom } from "jotai";
import { ethers } from "ethers";
import { appChain } from "../../contracts/AppChain";
// import { contractABI as nonAppChain } from "../../contracts/ContractAbi";

const DetailsCard = ({ details, owner, rpc }: any) => {
  // console.log("DETAILS", details);
  // const updateDetails = useRef<any>({});
  // const [maxLimit, setMaxLimit] = useState(0);
  // const [perSecondRate, setPerSecondRate] = useState(0);
  // const [, setIsMint] = useState(false);
  const [updateParams, setUpdateParams] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userAddr] = useAtom(userAddress);
  // const [detailsForUpdates, setdetailsForUpdate] = useAtom(detailsForUpdate);
  const renderLimitSection = (
    limitType: string,
    limitData: any,
    mintOrLock: boolean,
    isAppChain: boolean
  ) => {
    return (
      <div className="flex flex-col gap-2" style={{ width: "300px" }}>
        <h1 className="text-2xl font-semibold text-[#344054] ">{limitType}</h1>
        <div className="md:flex md:gap-3 text-nowrap">
          <p className="font-base text-[#667085]">Current Limit :</p>
          <p className="text-[#475467] flex items-center text-sm lg:text-base font-medium">
            {limitData?.currentLimit} {details?.token}
          </p>
        </div>
        <div className="md:flex md:gap-3 text-nowrap">
          <p className="font-base text-[#667085]">Max Limit :</p>
          <p className="text-[#475467] flex items-center text-sm lg:text-base font-medium">
            {limitData?.maxLimit} {details?.token}
          </p>
        </div>
        <div className="md:flex md:gap-3 text-nowrap">
          <p className="font-base text-[#667085]">Rate Per Second :</p>
          <p className="text-[#475467] flex items-center text-sm lg:text-base font-medium">
            {limitData?.ratePerSecond} {details?.token}
          </p>
        </div>
        <div className="md:flex md:gap-3 text-nowrap">
          <p className="font-base text-[#667085]">Last Update Limit :</p>
          <p className="text-[#475467] flex items-center text-sm lg:text-base font-medium">
            {limitData?.lastUpdateLimit} {details?.token}
          </p>
        </div>
        <div className="md:flex md:gap-3 text-nowrap">
          <p className="font-base  text-[#667085]">Last Update :</p>
          <p className="flex items-center text-sm lg:text-base font-medium text-[#475467]">
            {convertTimestampToIndianDateTime(limitData.lastUpdateTimestamp)}
          </p>
        </div>
        {userAddr !== owner && (
          <div>
            <Button
              onClick={() => {
                console.log("Limit Data", limitData);

                if (mintOrLock) {
                  if (!isAppChain) {
                    setUpdateParams({
                      mintLockOrBurnUnlock: "Lock",
                      maxLimit: limitData.maxLimit,
                      ratePerSecond: limitData.ratePerSecond,
                    });
                  } else {
                    setUpdateParams({
                      mintLockOrBurnUnlock: "Mint",
                      maxLimit: limitData.maxLimit,
                      ratePerSecond: limitData.ratePerSecond,
                    });
                  }
                } else {
                  if (!isAppChain) {
                    setUpdateParams({
                      mintLockOrBurnUnlock: "Unlock",
                      maxLimit: limitData.maxLimit,
                      ratePerSecond: limitData.ratePerSecond,
                    });
                  } else {
                    setUpdateParams({
                      mintLockOrBurnUnlock: "Burn",
                      maxLimit: limitData.maxLimit,
                      ratePerSecond: limitData.ratePerSecond,
                    });
                  }
                }

                // setIsMint(mintOrLock);
                setIsModalOpen(true);
              }}
              className="bg-black text-white"
              size="middle"
            >
              Update {limitType}
            </Button>
          </div>
        )}
      </div>
    );
  };

  const updateLimit = async () => {
    const CurrentChainId = ChainId[details?.source];
    // console.log("Current", +CurrentChainId);
    // return;

    await switchToChain(+CurrentChainId, rpc, details?.source);
    // console.log("UPDATE", currentRpcUrl, isAppChain, contractAddress);
    // const contractABI = details?.isAppChain ? appChain : nonAppChain;
    // const provider = new ethers.JsonRpcProvider(rpc);
    const findOwner = async () => {
      const provider = new ethers.JsonRpcProvider(
        "https://ethereum-sepolia.publicnode.com"
      );
      const contract = new ethers.Contract(
        "0xC927FBD7254E0f7337Df1D539AA2bd60AFb44F02",
        appChain,
        provider
      );

      console.log("UpdateParama", updateParams);

      const owner = await contract.owner();
      console.log("Owner", owner);
    };
    findOwner();
    // const contract = new ethers.Contract(
    //   details?.contractAddress,
    //   contractABI,
    //   provider
    // );
    // const constructParams;

    // const owner = await contract["updateLimitParams"]();
    // console.log("MODAL OWNER", owner);
  };

  return (
    <div className="flex flex-1   p-5 sm:flex md:flex flex-col bg-white  border-dashed rounded-t-lg border shadow-lg">
      {/* Header */}
      <div className="flex border-b  justify-between items-center  border p-2 rounded-t-lg">
        <div className="flex justify-between w-full items-center">
          <div>
            <p>{details?.source}</p>
          </div>
          <div>
            <svg
              width="31"
              height="20"
              viewBox="0 0 151 84"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M68.1002 41.3499C50.104 41.2042 32.1079 41.0874 14.1118 40.8905C10.5249 40.8505 6.93279 40.5689 3.36035 40.2178C2.76932 40.1535 2.21142 39.9124 1.75964 39.526C1.30786 39.1395 0.983227 38.6258 0.828173 38.0518C0.53479 37.133 1.55475 35.8295 2.77291 35.6378C3.95432 35.4521 5.12976 35.1639 6.31707 35.0924C13.8997 34.633 21.4818 33.9826 29.0717 33.8454C44.665 33.5652 60.2628 33.4943 75.8594 33.4765C90.6565 33.4595 105.454 33.6446 120.251 33.6787C122.627 33.6846 125.005 33.3853 127.377 33.1733C127.534 33.1345 127.679 33.0567 127.799 32.9472C127.918 32.8377 128.008 32.6999 128.061 32.5465C128.103 32.1803 127.995 31.562 127.751 31.4307C123.204 28.9589 118.713 26.3585 114.037 24.1526C103.16 19.0207 92.9557 12.7277 82.7588 6.41374C81.0832 5.37607 79.3268 4.32201 78.6508 2.26308C78.528 1.88831 78.3364 1.24642 78.4926 1.12106C79.052 0.599398 79.7318 0.224347 80.4715 0.0295109C81.2592 -0.0634608 82.0572 0.0642497 82.7765 0.39838C85.3244 1.55222 87.854 2.75664 90.333 4.05094C108.051 13.3014 125.763 22.5621 143.469 31.8331C150.157 35.3116 153.336 38.6846 145.307 46.3329C142.994 48.5375 140.654 50.7389 138.139 52.6993C126.475 61.8006 114.768 70.8462 103.018 79.8362C101.403 80.9957 99.699 82.0271 97.9228 82.9211C96.7644 83.5499 95.6046 83.177 94.6044 82.4229C93.5037 81.5926 92.8204 79.1793 93.1998 78.118C94.0432 75.7618 95.7235 74.0329 97.5278 72.4676C104.475 66.4411 111.46 60.4579 118.481 54.518C123.044 50.6365 127.655 46.812 132.211 42.9225C132.436 42.7309 132.447 42.1349 132.356 41.7766C132.296 41.6215 132.199 41.4833 132.074 41.3737C131.949 41.2642 131.799 41.1867 131.638 41.1478C129.256 40.9916 126.871 40.7927 124.488 40.8052C105.691 40.9045 86.8948 41.0283 68.0982 41.1767L68.1002 41.3499Z"
                fill="black"
              />
            </svg>
          </div>
          <div className="">
            <p className="">{details?.DestToken}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col   p-2 ">
        {/* Connector and Is App Chain */}
        <div>
          <div className="md:flex gap-3 items-center">
            <p className=" font-base text-nowrap text-[#667085]">Connector :</p>
            <p className="text-[#475467] flex items-center text-sm lg:text-base font-medium">
              {details?.connectorType}
            </p>
          </div>
          <div className="md:flex gap-3 items-center">
            <p className=" text-nowrap font-base text-[#667085]">
              Is App Chain :
            </p>
            <p className="text-[#475467] flex items-center text-sm lg:text-base font-medium">
              {details?.isAppChain ? "True" : "False"}
            </p>
          </div>
        </div>

        <Divider className=" my-3" />

        {/* Lock or Mint Limit */}
        {renderLimitSection(
          details?.isAppChain ? "Mint Limit" : "Lock Limit",

          details?.Result?.LockOrMint,
          true,
          details?.isAppChain
        )}

        <Divider />

        {/* Unlock or Burn Limit */}
        {renderLimitSection(
          details?.isAppChain ? "Burn Limit" : "Unlock Limit",
          details?.Result?.UnlockOrBurn,
          false,
          details?.isAppChain
        )}
      </div>
      {updateParams && (
        <LimitUpdateModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          // currentRpcUrl={rpc}
          // isAppChain={details?.isAppChain}
          // contractAddress={details?.contractAddress}
          updateParams={updateParams}
          token={details?.token}
          onConfirm={() => {
            updateLimit();
          }}
        />
      )}
    </div>
  );
};

export default DetailsCard;
