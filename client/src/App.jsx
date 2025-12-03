import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px", background: "#fafafa" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
