import { Button, Divider, Tooltip } from "antd";
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
import { tokenDecimals } from "../../constants/consts";
import { contractABI as nonAppChain } from "../../contracts/ContractAbi";

// import { contractABI as nonAppChain } from "../../contracts/ContractAbi";

const DetailsCard = ({ details, owner, rpc }: any) => {
  console.log("Details", details);

  const [txnHash, setTxnHash] = useState("");
  const [isTxnSuccess, setIsTxnSuccess] = useState(false);
  const [isTxnFailed, setIsTxnFailed] = useState(false);

  const [updateParams, setUpdateParams] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userAddr] = useAtom(userAddress);

  const renderLimitSection = (
    limitType: string,
    limitData: any,
    mintOrLock: boolean,
    isAppChain: boolean
  ) => {
    const handleUpdateButton = () => {
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
    };
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

        <div className="flex flex-col  gap-1">
          {userAddr?.toLowerCase() !== owner?.toLowerCase() ? (
            <Tooltip
              style={{
                display:
                  userAddr?.toLowerCase() === owner?.toLowerCase()
                    ? "none"
                    : "block",
              }}
              placement="bottom"
              title={
                <span className="text-xs">
                  Connect owner's wallet to update limits.
                </span>
              }
            >
              <Button
                disabled={userAddr?.toLowerCase() !== owner?.toLowerCase()}
                onClick={handleUpdateButton}
                className="bg-black text-white"
                size="middle"
              >
                Update {limitType}
              </Button>
            </Tooltip>
          ) : (
            <button
              disabled={userAddr?.toLowerCase() !== owner?.toLowerCase()}
              onClick={handleUpdateButton}
              className="bg-black w-48 py-1 px-3 rounded-md text-white"
              // size="middle"
            >
              Update {limitType}
            </button>
          )}
        </div>
      </div>
    );
  };

  const updateLimit = async () => {
    try {
      if (!window?.ethereum) return;
      const CurrentChainId = ChainId[details?.source];

      await switchToChain(+CurrentChainId, rpc, details?.source);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractABI = details?.isAppChain ? appChain : nonAppChain;
      const contract = new ethers.Contract(
        details?.contractAddress,
        contractABI,
        signer
      );

      let mintOrLock;

      if (updateParams.mintLockOrBurnUnlock === "Mint" || "Lock") {
        mintOrLock = true;
      } else if (updateParams.mintLockOrBurnUnlock === "Burn" || "Unlock") {
        mintOrLock = false;
      }

      const currentTokenDecimal =
        tokenDecimals[details?.token as keyof typeof tokenDecimals];
      const maxLimitForContract = ethers.parseUnits(
        maxLimit.toString(),
        currentTokenDecimal
      );
      const ratePerSecondForContract = ethers.parseUnits(
        perSecondRate.toString(),
        currentTokenDecimal
      );

      const resultParamsForLockOrMint = await contract["updateLimitParams"]([
        [
          mintOrLock,
          details?.connectorAddr,
          maxLimitForContract,
          ratePerSecondForContract,
        ],
      ]);

      const { hash } = resultParamsForLockOrMint;
      setTxnHash(hash);

      console.log("Txn Pending", resultParamsForLockOrMint);
      const res = await resultParamsForLockOrMint.wait();
      console.log("Txn Done", res);
      if (res.status === 1) {
        setIsTxnSuccess(true);
      } else if (res.status === 0) {
        setIsTxnFailed(false);
      }
      // setIsModalOpen(false);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const [maxLimit, setMaxLimit] = useState(
    updateParams.maxLimit && parseFloat(updateParams.maxLimit)
  );
  const [perSecondRate, setPerSecondRate] = useState(
    updateParams.ratePerSecond && updateParams.ratePerSecond
  );

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
          maxLimit={maxLimit}
          setMaxLimit={setMaxLimit}
          perSecondRate={perSecondRate}
          setPerSecondRate={setPerSecondRate}
          txnHash={txnHash}
          chain={details?.source}
          setTxnHash={setTxnHash}
          isTxnSuccess={isTxnSuccess}
          setIsTxnSuccess={setIsTxnSuccess}
          isTxnFailed={isTxnFailed}
          setIsTxnFailed={setIsTxnFailed}
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
