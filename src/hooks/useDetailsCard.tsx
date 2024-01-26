import React, { useState } from "react";
import { userAddress } from "../atoms/atoms";
import { useAtom } from "jotai";
import { Button, Tooltip } from "antd";
import {
  convertTimestampToIndianDateTime,
  switchToChain,
} from "../helper/basicFunctions";
import { ethers } from "ethers";
import { AppChainABI } from "../contracts/AppChain";
import { NonAppChainABI } from "../contracts/NonAppChain";
import { tokenDecimals } from "../constants/consts";
import { ChainId } from "@socket.tech/dl-core";

const useDetailsCard = ({
  owner,
  rpc,
  details,
}: {
  owner: string;
  rpc: string;
  details: any;
}) => {
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
      const contractABI = details?.isAppChain ? AppChainABI : NonAppChainABI;
      const contract = new ethers.Contract(
        details?.contractAddress,
        contractABI,
        signer
      );

      let mintOrLock;

      if (
        updateParams.mintLockOrBurnUnlock === "Mint" ||
        updateParams.mintLockOrBurnUnlock === "Lock"
      ) {
        mintOrLock = true;
      } else if (
        updateParams.mintLockOrBurnUnlock === "Burn" ||
        updateParams.mintLockOrBurnUnlock === "Unlock"
      ) {
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

      console.log(
        mintOrLock,
        details?.connectorAddr,
        maxLimitForContract,
        ratePerSecondForContract
      );

      // return;

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
  return {
    txnHash,
    setTxnHash,
    isTxnSuccess,
    setIsTxnSuccess,
    isTxnFailed,
    setIsTxnFailed,
    updateParams,
    setUpdateParams,
    isModalOpen,
    setIsModalOpen,
    renderLimitSection,
    userAddr,
    owner,
    updateLimit,
    maxLimit,
    setMaxLimit,
    perSecondRate,
    setPerSecondRate,
  };
};

export default useDetailsCard;
