import { Outlet } from "react-router-dom";

function App() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar will go here later */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
