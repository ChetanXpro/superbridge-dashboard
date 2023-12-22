import {
  ChainSlug,
  DeploymentMode,
  Project,
  getSuperBridgeAddresses,
} from "@socket.tech/socket-plugs";
import { Button, Select } from "antd";
import { ethers } from "ethers";
import React, { useState } from "react";
import { contractABI } from "../../constracts/ContractAbi";

const Dashboard = () => {
  const [selectedDeploymentMode, setSelectedDeploymentMode] =
    useState<DeploymentMode>(DeploymentMode.PROD);

  const [selectedProject, setSelectedProject] = useState<Project>();
  const [chains, setChains] = useState([]) as any;
  const [selectedChainsDetails, setSelectedChainsDetails] = useState({});
  const handleModeChange = (e: any) => {
    const mode = e;
    setSelectedDeploymentMode(mode);
  };
  const allDeploymentModes = [
    {
      label: "Production",
      value: DeploymentMode.PROD,
    },

    {
      label: "Development",
      value: DeploymentMode.DEV,
    },
    {
      label: "Surge",
      value: DeploymentMode.SURGE,
    },
  ];

  const allProjects = Object.keys(Project).map((key) => {
    return {
      label: Project[key as keyof typeof Project],
      value: Project[key as keyof typeof Project],
    };
  });

  const getChains = async () => {
    console.log(selectedDeploymentMode);
    console.log(selectedProject);

    if (!selectedDeploymentMode || !selectedProject)
      return alert("Select All Fields");

    const addresses = await getSuperBridgeAddresses(
      selectedDeploymentMode || DeploymentMode.PROD,
      (selectedProject as Project) || Project.AEVO
    );

    setChains(() => {
      return Object.keys(addresses).map((address: any) => {
        return {
          label: ChainSlug[address],
          value: ChainSlug[address],
        };
      });
    });

    setSelectedChainsDetails(addresses);
  };

  const handleProjectChange = (e: any) => {
    console.log(e);

    setSelectedProject(e);
    // getChains(selectedDeploymentMode, e);
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const onSearch = (value: string) => {
    console.log("search:", value);
  };

  const fetchLimits = async () => {
    const provider = new ethers.JsonRpcProvider(
      "https://rpc.ankr.com/optimism"
    );

    const contractAddress = "0x7809621a6D7e61E400853C64b61568aA773A28Ef";

    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );

    async function callContractFunction() {
      try {
        const result = await contract["getLockLimitParams"](
          "0xF0A0B2E99D081Ee737496DAD5E2267ab12139793"
        ); // Replace with the actual function name
        console.log("Result:", result);
        console.log(Object.values(result));

        Object.values(result).forEach((value: any, index: any) => {
          // console.log("index", index);

          if (index === 0) {
            // console.log("0", value);
            // const date = new Date(value.toString());
            // console.log(date);
          }
        });
        const dateObjects = Object.values(result).map((timestamp) =>
          // console.log(typeof timestamp)
          ethers.formatUnits(timestamp, 6)
        );

        console.log(dateObjects);

        console.log(dateObjects);

        // for (const key in result) {
        //   const tokenDecimalPlaces = 18;

        //   // Example: Value in the raw integer form (without decimal places)
        //   const rawValue = ethers.parseUnits("123.456789", tokenDecimalPlaces);

        //   // Format the value to a human-readable format
        //   const formattedValue = ethers.formatUnits(
        //     rawValue,
        //     tokenDecimalPlaces
        //   );

        //   // console.log("Formatted Value:", formattedValue);
        //   console.log(ethers.formatUnits(result[key], tokenDecimalPlaces));
        // }
      } catch (error) {
        console.error("Error calling contract function:", error);
      }
    }
    await callContractFunction();
  };
  return (
    <div className="flex flex-col bg-gray-100 items-center p-10 h-full w-full">
      <div>
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      </div>
      <div className="flex flex-col items-center  h-[50%] mt-10">
        <div className=" flex flex-col items-center  justify-between h-[30%] gap-10  ">
          <div className=" flex gap-2">
            <div className="w-[10rem] ">
              <h1>Select mode</h1>
              <Select
                className="w-full"
                defaultValue={DeploymentMode.PROD}
                // style={{ width: 120 }}
                onChange={handleModeChange}
                options={allDeploymentModes}
              />
            </div>
            <div className="  w-[10rem]">
              <h1>Select Project</h1>
              <Select
                className="w-full"
                showSearch
                placeholder="Select a person"
                optionFilterProp="children"
                // defaultValue={Project.AEVO}
                onChange={handleProjectChange}
                onSearch={onSearch}
                filterOption={filterOption}
                options={allProjects}
              />
            </div>
            <div className="h-full flex flex-col  items-end justify-end">
              <Button onClick={getChains}>Get Chain</Button>
            </div>
          </div>
          {chains.length > 0 && (
            <div className="w-full flex gap-3 items-center">
              <div className="  w-full">
                <h1>Select Chain</h1>
                <Select
                  placeholder="Select a Chain"
                  // defaultValue={chains[0]?.value}
                  className=" w-full"
                  // style={{ width: 120 }}
                  // onChange={handleModeChange}
                  options={chains}
                />
              </div>

              <div className="h-full flex  items-end">
                <Button disabled={chains.length === 0} onClick={fetchLimits}>
                  Fetch Limits
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <section className="grid   grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex flex-wrap">
          <div className="flex flex-col bg-blue-100 rounded-t-lg border-blue-500 border-2 shadow-lg ">
            <div className="flex gap-5 border-b  items-center bg-blue-200 p-2 rounded-t-lg">
              <div>
                <p>Ethereum</p>
              </div>
              <div className="">
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
              <div>
                <p>Solana</p>
              </div>
            </div>
            <div>Last transaction</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
