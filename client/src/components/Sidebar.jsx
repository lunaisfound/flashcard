import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [projects, setProjects] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // Load projects
  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Failed to load projects:", err));
  }, []);

  async function createProject() {
    if (!newTitle.trim()) return;

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });

    const proj = await res.json();
    setProjects([...projects, proj]);
    setNewTitle("");
    navigate(`/projects/${proj._id}`);
  }

  const width = collapsed ? "60px" : "260px";

  return (
    <div
      style={{
        width,
        height: "100vh",
        background: "#f7f5f3",
        padding: "20px 10px",
        borderRight: "1px solid #ddd",
        boxSizing: "border-box",
        position: "fixed",
        left: 0,
        top: 0,
        overflowY: "auto",
        transition: "width 0.2s ease",
      }}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          marginBottom: "20px",
          width: "100%",
          padding: "8px",
          border: "none",
          background: "#eee",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {collapsed ? "→" : "←"}
      </button>

      {/* Title */}
      {!collapsed && <h2>Projects</h2>}

      {/* Add project */}
      {!collapsed && (
        <div style={{ marginBottom: "20px" }}>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="New project"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              marginBottom: "8px",
            }}
          />

          <button
            onClick={createProject}
            style={{
              width: "100%",
              padding: "8px",
              background: "#db4c3f",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            + Add Project
          </button>
        </div>
      )}

      {/* Project List */}
      {projects.map((p) => (
        <Link
          key={p._id}
          to={`/projects/${p._id}`}
          style={{
            display: "block",
            padding: collapsed ? "10px 8px" : "10px",
            borderRadius: "6px",
            background: "white",
            border: "1px solid #eee",
            color: "#333",
            textDecoration: "none",
            marginBottom: "6px",
            textAlign: collapsed ? "center" : "left",
          }}
        >
          {collapsed ? "•" : p.title}
        </Link>
      ))}
    </div>
  );
}
