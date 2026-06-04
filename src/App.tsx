import { ConfigProvider, theme } from "antd";
import Dashboard from "@/pages/Dashboard";

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          fontFamily: '"PingFangSC", "PingFang SC", system-ui, sans-serif',
        },
      }}
    >
      <Dashboard />
    </ConfigProvider>
  );
}

export default App;
