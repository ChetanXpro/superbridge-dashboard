import { Divider } from "antd";
import { convertTimestampToIndianDateTime } from "../../helper/basicFunctions";

const DetailsCard = ({ details }: any) => {
  const renderLimitSection = (limitType: string, limitData: any) => {
    return (
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">{limitType}</h1>

        {Object.keys(limitData).map((key, index) => (
          <div key={index} className="md:flex md:gap-3 text-nowrap">
            <p className="font-bold">{key} :</p>
            <p className="text-gray-700">
              {limitData[key]} {details?.token}
            </p>
          </div>
        ))}

        <div className="md:flex md:gap-3 text-nowrap">
          <p className="font-bold">Last Update :</p>
          <p className="text-gray-700">
            {convertTimestampToIndianDateTime(limitData.lastUpdateTimestamp)}
          </p>
        </div>
      </div>
    );
  };
  return (
    <div className="flex flex-1 p-5 sm:flex md:flex flex-col bg-blue-100 rounded-t-lg border-blue-500 border-2 shadow-lg">
      {/* Header */}
      <div className="flex border-b justify-between items-center bg-blue-200 p-2 rounded-t-lg">
        <div className="flex justify-between w-full items-center">
          <div>
            <p>{details?.source}</p>
          </div>
          <div className="">
            {/* Your SVG or other icons */}
            <p>{details?.DestToken}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-1 p-2">
        {/* Connector and Is App Chain */}
        <div>
          <div className="md:flex gap-3 items-center">
            <p className="text-lg font-semibold text-nowrap">Connector :</p>
            <p className="text-gray-700">{details?.connectorType}</p>
          </div>
          <div className="md:flex gap-3">
            <p className="text-lg text-nowrap font-semibold">Is App Chain :</p>
            <p className="text-gray-700">
              {details?.isAppChain ? "True" : "False"}
            </p>
          </div>
        </div>

        <Divider className="" />

        {/* Lock or Mint Limit */}
        {renderLimitSection(
          details?.isAppChain ? "Mint Limit" : "Lock Limit",
          details?.Result?.LockOrMint
        )}

        <Divider />

        {/* Unlock or Burn Limit */}
        {renderLimitSection(
          details?.isAppChain ? "Burn Limit" : "Unlock Limit",
          details?.Result?.UnlockOrBurn
        )}
      </div>
    </div>
  );
};

export default DetailsCard;
