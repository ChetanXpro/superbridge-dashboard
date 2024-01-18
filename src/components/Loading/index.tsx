import { ClockLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="h-[100px] w-[100px] rounded-lg overflow-hidden">
        <div
          title=""
          role="button"
          aria-label="animation"
          //   tabindex="0"
          style={{
            width: "100px",
            height: "100px",
            overflow: "hidden",
            margin: "0px auto",
            outline: "none",
          }}
          className="bg-[#7f1fff] flex items-center justify-center"
        >
          {/* <div aria-label="Loading..." className="bg-red-400" role="status"> */}

          <ClockLoader color="white" />
          {/* </div> */}
        </div>
      </div>
      <span className="flex mt-1 p-2 justify-center text-[#475467]  text-xl font-medium">
        Fetching Transaction Limits
      </span>
      <div className="flex m-1 justify-center text-[#657795]  text-center font-normal md:w-1/2">
        Please wait a moment while we load your transaction Limits, this could
        take a few seconds.
      </div>
    </div>
  );
};

export default Loading;
