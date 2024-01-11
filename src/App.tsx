import { useEffect } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard/Dashboard";
import Navbar from "./components/Navbar";
// import { toast } from "react-hot-toast";
import { checkIfWalletConnected } from "./helper/basicFunctions";
import Footer from "./components/Footer";

function App() {
  useEffect(() => {
    checkIfWalletConnected();
  }, []);
  return (
    <div className="font-matterRegular min-h-screen w-full">
      <Navbar />
      <Dashboard />
      <Footer />
    </div>
  );
}

export default App;
