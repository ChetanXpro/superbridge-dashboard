import { Button, Divider } from "antd";
import { ChainId } from "@socket.tech/dl-core";

import {
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
      <div className="flex  flex-col gap-2" style={{ width: "300px" }}>
        <h1 className="mr-2 uppercase  text-normal font-matterMedium text-[#344054] ">
          {limitType}
        </h1>
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
        {userAddr && userAddr !== owner && (
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
    <div className="flex  flex-1 border border-dashed    p-5 sm:flex md:flex flex-col  bg-white  rounded-t-lg  shadow-xl ">
      {/* Header */}
      <div className="flex border-b  justify-between items-center  border p-2 rounded-t-lg">
        <div className="flex justify-between w-full items-center">
          <div>
            <p>{details?.source}</p>
          </div>
          <div>
            <svg
              width="18"
              height="14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
            >
              <path
                d="M11 .342c-.256 0-.512.1-.707.295l-.086.086a.999.999 0 0 0 0 1.414L14.07 6H1a1 1 0 0 0 0 2h13.07l-3.863 3.863a.999.999 0 0 0 0 1.414l.086.086a.999.999 0 0 0 1.414 0l5.656-5.656a.999.999 0 0 0 0-1.414L11.707.637A.998.998 0 0 0 11 .342Z"
                fill="#667085"
              ></path>
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
