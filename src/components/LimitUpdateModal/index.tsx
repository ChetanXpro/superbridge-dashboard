import { ConfigProvider, Input, Modal } from "antd";

import { useEffect, useState } from "react";
import { SECONDS_IN_DAY, chainExplorerEnum } from "../../constants/consts";
import { ChainSlug } from "@socket.tech/socket-plugs";
import { CopyIcon, CorrectGreenIcon, OpenExplorerIcon } from "../Icons/Icons";

const LimitUpdateModal = ({
  isModalOpen,
  setIsModalOpen,
  onConfirm,
  maxLimit,
  chain,
  setMaxLimit,
  perSecondRate,
  setPerSecondRate,
  txnHash,
  setTxnHash,
  updateParams,
  setIsTxnFailed,
  isTxnFailed,
  token,
  onCloseAndRefresh,
  isTxnSuccess,
  setIsTxnSuccess,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  onConfirm: () => void;
  chain: string;
  txnHash: string;
  setIsTxnFailed: (value: boolean) => void;
  isTxnFailed: boolean;
  onCloseAndRefresh: () => void;
  setTxnHash: (value: string) => void;
  maxLimit: number;
  isTxnSuccess: boolean;
  setIsTxnSuccess: (value: boolean) => void;
  setMaxLimit: (value: number) => void;
  perSecondRate: string;
  setPerSecondRate: (value: string) => void;

  updateParams: {
    mintLockOrBurnUnlock: string;
    maxLimit: number;
    ratePerSecond: string;
  };
  token: string;
}) => {
  const handleOk = () => {
    onConfirm();
  };
  const [isTextCopied, setIsTextCopied] = useState(false);
  const handleCancel = () => {
    if (txnHash) {
      onCloseAndRefresh();
    }

    setIsModalOpen(false);
    setIsTxnFailed(false);
    setIsTxnSuccess(false);
    setTxnHash("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsTextCopied(true);

    setTimeout(() => {
      setIsTextCopied(false);
    }, 2000);
  };

  useEffect(() => {
    setPerSecondRate(updateParams.ratePerSecond && updateParams.ratePerSecond);
    setMaxLimit(
      updateParams.maxLimit && parseFloat(updateParams.maxLimit.toString())
    );
  }, [updateParams]);

  useEffect(() => {
    if (maxLimit && perSecondRate) {
      // Calculate rate per second
      const limit = Number(maxLimit) / SECONDS_IN_DAY;
      console.log("Rate Limit", limit.toFixed(4));

      setPerSecondRate(limit.toFixed(4));
    }
  }, [maxLimit]);

  return (
    <>
      <ConfigProvider
        theme={{
          token: {},
          components: {
            Button: {
              defaultBg: "#212429",
              colorPrimaryHover: "#212429",
            },
          },
        }}
      >
        <Modal
          title={`Update ${updateParams.mintLockOrBurnUnlock} Limit`}
          className=""
          open={isModalOpen}
          cancelText={txnHash ? "Close & Refresh" : "Cancel"}
          onOk={handleOk}
          okText="Update Limit"
          okType="primary"
          onCancel={handleCancel}
          rootClassName=""
          okButtonProps={{
            className: "bg-[#212429] border text-white  hover:bg-[#212429]",

            disabled: !!txnHash,
          }}
        >
          <div className="flex flex-col py-4 gap-3">
            <div className="flex  flex-col gap-2">
              <p className="font-bold">Max Limit</p>
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
            {txnHash && (
              <div className="flex gap-1 items-center">
                <span className="font-bold">Transaction Hash :</span>

                {txnHash.slice(0, 6) + "..." + txnHash.slice(-4)}

                {chainExplorerEnum[
                  ChainSlug[chain as keyof typeof ChainSlug]
                ] && (
                  <a
                    href={`${
                      chainExplorerEnum[
                        ChainSlug[chain as keyof typeof ChainSlug]
                      ] || ""
                    }/tx/${txnHash}`}
                    target="_blank"
                    className="text-blue-500"
                    rel="noreferrer"
                  >
                    <OpenExplorerIcon />
                  </a>
                )}

                {isTextCopied ? (
                  <div className="cursor-pointer">
                    <div className="flex items-center font-normal">
                      <CorrectGreenIcon />
                      <span className="text-socket-secondary text-sm hidden md:inline-block">
                        Copied
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => copyToClipboard(txnHash)}
                    className="cursor-pointer"
                  >
                    <CopyIcon />
                  </div>
                )}
              </div>
            )}
            {(isTxnSuccess || isTxnFailed || txnHash) && (
              <div className="flex gap-2 items-center">
                <span className="font-bold">Transaction Status :</span>
                <p
                  className={`${
                    isTxnSuccess
                      ? "text-green-500"
                      : isTxnFailed
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  {isTxnSuccess
                    ? "Success"
                    : isTxnFailed
                    ? "Failed"
                    : txnHash && "Waiting"}
                </p>
              </div>
            )}
          </div>
        </Modal>
      </ConfigProvider>
    </>
  );
};

export default LimitUpdateModal;
