import { ChainSlug, DeploymentMode } from "@socket.tech/socket-plugs";

import { Empty, Input, Select } from "antd";

import { RpcEnum } from "../../constants/consts";

import DetailsCard from "../DetailCard/DetailsCard";
import Loading from "../Loading";

import useDashboard from "../../hooks/useDashboard";
import { CopyIcon, CorrectGreenIcon } from "../Icons/Icons";

const Dashboard = () => {
  const {
    chains,
    selectedChain,
    setSelectedChain,
    isFetchingLimits,

    selectedDeploymentMode,
    fetchedResults,
    rpcUrl,
    setRpcUrl,
    tokenOwner,

    isTextCopied,

    changeRpcUrl,
    setChangeRpcUrl,

    allDeploymentModes,
    allProjects,

    copyTextIndex,
    copyToClipboard,
    handleProjectChange,
    isModalOpen,

    setIsModalOpen,
    getChains,
    handleModeChange,
    fetchLimits,
    filterOption,
  } = useDashboard();

  return (
    <div className="flex flex-col justify-between   items-center   min-h-screen w-full">
      <div className="text-white w-full px-4  py-6  flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#9747ff] to-[#7f1fff]">
        <div className="relative flex flex-col mx-auto items-center  max-w-[1280px] ">
          <h1 className="text-3xl md:text-4xl font-semibold">
            Superbridge Dashboard
          </h1>
          <p className="text-sm text-center sm:text-base max-w-[960px] sm:px-5 md:font-medium font-matterLight mb-6 mt-4 sm:mt-2">
            Track all your bridge transaction limits for all supported tokens
            across your App chain and connected chains.
          </p>
          <div className="w-full mt-2 grid grid-cols-1  md:grid-rows-2 gap-4 rounded-lg max-w-[400px]     border-opacity-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="flex items-start flex-col gap-2 rounded-lg">
                <h1 className="text-base font-bold">Select mode</h1>
                <Select
                  size="large"
                  className="w-full"
                  defaultValue={DeploymentMode.PROD}
                  onSelect={(e) => {
                    handleModeChange(e);
                  }}
                  options={allDeploymentModes}
                />
              </div>

              <div className="flex items-start flex-col gap-2">
                <h1 className="text-base font-bold">Select Project</h1>
                <Select
                  className="w-full"
                  size="large"
                  showSearch
                  placeholder="Select a project"
                  optionFilterProp="children"
                  onSelect={(e) => {
                    getChains(e, selectedDeploymentMode);
                  }}
                  onChange={handleProjectChange}
                  filterOption={filterOption}
                  options={allProjects}
                />
              </div>
            </div>

            <div>
              {chains.length > 0 && (
                <div className="flex flex-col md:flex-row gap-4  w-full">
                  <div className="flex items-start flex-col gap-2 w-full">
                    <h1 className="text-base font-bold">Select Chain</h1>
                    <Select
                      size="large"
                      placeholder="Select a Chain"
                      value={selectedChain || chains[0]?.value}
                      autoClearSearchValue={true}
                      className="w-full"
                      onChange={(e) => {
                        setSelectedChain(e);
                        setRpcUrl(RpcEnum[Number(ChainSlug[e])]);
                      }}
                      options={chains}
                    />
                  </div>

                  <div className="flex items-end w-full">
                    <button
                      onClick={fetchLimits}
                      disabled={chains.length === 0}
                      className="relative sm:py-2 hover:bg-gray-900  sm:px-[50px] py-2  sm:rounded-lg rounded-md bg-black text-white  text-sm sm:text-base disabled:bg-[#98a2b3] w-full"
                    >
                      Fetch Limits
                    </button>
                  </div>
                </div>
              )}
            </div>

            {changeRpcUrl && (
              <div className=" flex flex-col items-start gap-2">
                <h1 className="text-base font-bold">Rpc Url</h1>
                <Input
                  size="large"
                  onChange={(e) => setRpcUrl(e.target.value)}
                  value={rpcUrl}
                  placeholder={`Enter RPC Url for ${selectedChain?.toLowerCase()} Chain`}
                />
              </div>
            )}
            {!changeRpcUrl && chains.length > 0 && (
              <div
                onClick={() => setChangeRpcUrl(true)}
                className="flex ml-1 items-end w-full"
              >
                <p className="text-sm cursor-pointer">Change RPC ?</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <section className=" gap-6 bg-[#F9FAFB]  flex-1 justify-center flex items-center   w-full">
        {!isFetchingLimits ? (
          <div className="flex flex-wrap   gap-3 p-2  w-full    justify-center md:p-7">
            {Object.keys(fetchedResults).length > 0 ? (
              Object.keys(fetchedResults).map((token: any, index) => (
                <div
                  key={index}
                  className="  rounded-lg bg-white  w-full md:w-auto flex flex-col items-center p-2 md:p-10 gap-10 "
                >
                  <div className="flex flex-col gap-1 items-center">
                    <h1 className=" text-[#344054] text-xl sm:text-[28px] font-semibold flex items-center">
                      {token}
                    </h1>
                    <div className="flex flex-col gap-3">
                      <div className="md:flex  md:gap-3 flex gap-2 text-nowrap  items-center ">
                        <p className="font-bold">Owner :</p>
                        <div className="flex   gap-1 items-center">
                          <p className="text-gray-700">
                            {tokenOwner[token]?.slice(0, 6) +
                              "..." +
                              tokenOwner[token].slice(-4)}
                          </p>
                          {isTextCopied && copyTextIndex === index ? (
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
                              onClick={() =>
                                copyToClipboard(tokenOwner[token], index)
                              }
                              className="cursor-pointer"
                            >
                              <CopyIcon />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" flex flex-wrap items-center justify-center gap-3 ">
                    {fetchedResults[token]?.map((item: any, index: any) => (
                      <DetailsCard
                        key={index}
                        setIsModalOpen={setIsModalOpen}
                        isModalOpen={isModalOpen}
                        details={item}
                        owner={tokenOwner[token]}
                        rpc={rpcUrl}
                        fetchLimits={fetchLimits}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full text-black items-center justify-center   w-full flex-1 ">
                <Empty
                  rootClassName="text-red-300"
                  description=""
                  className="text-red-400"
                />
                <p className="text-center text-[#667085] font-medium sm:font-semibold sm:mt-3 mt-2 sm:text-base text-sm">
                  No Limits To Show
                </p>
              </div>
            )}
          </div>
        ) : (
          <Loading />
        )}
      </section>
    </div>
  );
};

export default Dashboard;
