import { Input, Modal } from "antd";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { detailsForUpdate } from "../../atoms/atoms";
import { Utils } from "alchemy-sdk";
import { tokenDecimals } from "../../constants/consts";
import { ethers } from "ethers";

const LimitUpdateModal = ({
  isModalOpen,
  setIsModalOpen,
  onConfirm,
  currentRpcUrl,
  isAppChain,
  contractAddress,
  updateParams,
  token,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  onConfirm: () => void;
  currentRpcUrl: string;
  isAppChain: boolean;
  contractAddress: string;
  updateParams: any;
  token: string;
}) => {
  //   const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("Details", updateParams);

  const [maxLimit, setMaxLimit] = useState(
    updateParams.maxLimit && parseFloat(updateParams.maxLimit)
  );
  const [perSecondRate, setPerSecondRate] = useState(
    updateParams.ratePerSecond && updateParams.ratePerSecond
  );

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    onConfirm();
    setIsModalOpen(false);
    // update();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    // Reset state when updateParams changes
    setPerSecondRate(updateParams.ratePerSecond && updateParams.ratePerSecond);
    setMaxLimit(updateParams.maxLimit && parseFloat(updateParams.maxLimit));
  }, [updateParams]);

  useEffect(() => {
    if (maxLimit && perSecondRate) {
      const limit = Number(maxLimit) / 86400;
      console.log("Rate Limit", limit.toFixed(4));

      setPerSecondRate(limit.toFixed(4));

      // console.log("TO SHOW", ethers.parseUnits(dev.toFixed(6).toString(), 6));
    }
  }, [maxLimit]);

  return (
    <>
      <Modal
        title={`Update ${updateParams.mintLockOrBurnUnlock} Limit`}
        className=""
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        rootClassName=""
        okButtonProps={{ className: "bg-blue-500" }}
      >
        <div className="flex flex-col py-4 gap-3">
          <div className="flex  flex-col gap-2">
            <p className="font-bold">Limit</p>
            <Input
              className="text-gray-700"
              placeholder="Enter Limit"
              size="middle"
              value={maxLimit}
              onChange={(e) => {
                setMaxLimit(parseFloat(e.target.value));
              }}
              type="number"
              min={0}
            />
          </div>
          <div className="flex items-center gap-1">
            <h1 className="font-bold">Rate limit :</h1>
            <p className="text-xs text-gray-500">
              {perSecondRate} {token}
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LimitUpdateModal;
