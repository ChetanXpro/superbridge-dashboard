import "./App.css";
import Dashboard from "./components/Dashboard/Dashboard";
import { Button, notification, Space } from "antd";

function App() {
  type NotificationType = "success" | "info" | "warning" | "error";
  const [api, contextHolder] = notification.useNotification();
  return (
    <div className=" min-h-screen w-full">
      {contextHolder}
      <Dashboard />
    </div>
  );
}

export default App;
