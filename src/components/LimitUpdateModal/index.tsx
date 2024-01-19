import { ConfigProvider, Input, Modal } from "antd";

import { useEffect, useState } from "react";
import { chainExplorerEnum } from "../../constants/consts";
import { ChainSlug } from "@socket.tech/socket-plugs";

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
  updateParams: any;
  token: string;
}) => {
  const handleOk = () => {
    onConfirm();
  };

  const handleCancel = () => {
    if (txnHash) {
      onCloseAndRefresh();
    }

    setIsModalOpen(false);
    setIsTxnFailed(false);
    setIsTxnSuccess(false);
    setTxnHash("");
  };
  const [isTextCopied, setIsTextCopied] = useState(false);
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsTextCopied(true);

    setTimeout(() => {
      setIsTextCopied(false);
    }, 2000);
  };
  useEffect(() => {
    // Reset state when updateParams changes
    setPerSecondRate(updateParams.ratePerSecond && updateParams.ratePerSecond);
    setMaxLimit(updateParams.maxLimit && parseFloat(updateParams.maxLimit));
  }, [updateParams]);

  useEffect(() => {
    if (maxLimit && perSecondRate) {
      // Calculate rate per second
      const limit = Number(maxLimit) / 86400;
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
                    }/${txnHash}`}
                    target="_blank"
                    className="text-blue-500"
                    rel="noreferrer"
                  >
                    <svg
                      width="16"
                      height="17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      className="fill-[#475467]  hover:fill-[#7f1fff]"
                    >
                      <path d="M3.333 2.105C2.605 2.105 2 2.71 2 3.44v9.333c0 .729.605 1.333 1.333 1.333h9.334c.728 0 1.333-.604 1.333-1.333V8.105h-1.333v4.667H3.333V3.44H8V2.105H3.333Zm6 0V3.44h2.391L5.529 9.634l.942.943 6.196-6.196v2.391H14V2.105H9.333Z"></path>
                    </svg>
                  </a>
                )}

                {isTextCopied ? (
                  <div className="cursor-pointer">
                    <div className="flex items-center font-normal">
                      <svg
                        width="17"
                        height="18"
                        viewBox="0 0 22 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        className="mx-1"
                      >
                        <g
                          clip-path="url(#copied_svg__a)"
                          stroke="#039855"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M19.552 9.154V10a9.09 9.09 0 1 1-5.391-8.31"></path>
                          <path d="m20.461 1.818-10 10-2.727-2.727"></path>
                        </g>
                        <defs>
                          <clipPath id="copied_svg__a">
                            <path
                              fill="#fff"
                              transform="translate(.46)"
                              d="M0 0h20.909v20H0z"
                            ></path>
                          </clipPath>
                        </defs>
                      </svg>
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
                    <svg
                      width="17"
                      height="18"
                      viewBox="0 0 25 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      className="mx-1 fill-[#717d8a] hover:fill-[#7f1fff]"
                    >
                      <path d="M4.46 2a2 2 0 0 0-2 2v13a1 1 0 0 0 2 0V4h13a1 1 0 0 0 0-2h-13Zm4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-12Zm0 2h12v12h-12V8Z"></path>
                    </svg>
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
