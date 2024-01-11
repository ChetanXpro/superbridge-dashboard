import { useEffect } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard/Dashboard";
import Navbar from "./components/Navbar";
import { toast } from "react-hot-toast";
import { checkIfWalletConnected } from "./helper/basicFunctions";

function App() {
  useEffect(() => {
    checkIfWalletConnected();
  }, []);
  return (
    <div className=" min-h-screen w-full">
      <Navbar />
      <Dashboard />
      {/* <Footer /> */}
      <div className=" "></div>
    </div>
  );
}

export default App;
