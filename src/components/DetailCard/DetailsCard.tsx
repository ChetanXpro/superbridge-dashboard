import { Divider } from "antd";

import LimitUpdateModal from "../LimitUpdateModal";

import { RightArrowIcon } from "../Icons/Icons";
import useDetailsCard from "../../hooks/useDetailsCard";
import { IDetails } from "../../type/types";

const DetailsCard = ({
  details,
  owner,
  rpc,
  fetchLimits,
}: {
  details: IDetails;
  owner: string;
  rpc: string;
  fetchLimits: () => void;
}) => {
  const {
    isModalOpen,
    isTxnFailed,
    isTxnSuccess,
    setIsModalOpen,
    setIsTxnFailed,
    setIsTxnSuccess,
    setTxnHash,
    txnHash,
    updateParams,
    maxLimit,
    setMaxLimit,
    perSecondRate,
    setPerSecondRate,
    updateLimit,
    renderLimitSection,
  } = useDetailsCard({
    owner,
    rpc,
    details,
  });

  // console.log("Update Params", updateParams);

  return (
    <div className="flex  flex-1 border border-dashed    p-5 sm:flex md:flex flex-col  bg-white  rounded-t-lg  shadow-xl ">
      {/* Header */}
      <div className="flex border-b  justify-between items-center  border p-2 rounded-t-lg">
        <div className="flex justify-between w-full items-center">
          <div>
            <p>{details?.source}</p>
          </div>
          <div>
            <RightArrowIcon />
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
          onCloseAndRefresh={fetchLimits}
          onConfirm={() => {
            updateLimit();
          }}
        />
      )}
    </div>
  );
};

export default DetailsCard;
