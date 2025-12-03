import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div
        id="main"
        style={{
          padding: "20px",
          marginLeft: "260px", // default (will be overridden by CSS variable)
          transition: "margin-left 0.2s ease",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default App;
