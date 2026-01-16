import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [projects, setProjects] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

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

  // delete project
  async function deleteProject(id) {
    const ok = window.confirm("Delete this project?");
    if (!ok) return;

    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Failed to delete project");
      return;
    }

    // Remove it locally
    setProjects((prev) => prev.filter((p) => p._id !== id));

    // If you are inside the deleted project, go home
    navigate("/");
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

      {!collapsed && <h2>Projects</h2>}

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
        <div
          key={p._id}
          style={{
            display: "flex",
            alignItems: "center",
            background: "white",
            border: "1px solid #eee",
            borderRadius: "6px",
            padding: "8px",
            marginBottom: "6px",
          }}
        >
          <Link
            to={`/projects/${p._id}`}
            style={{
              textDecoration: "none",
              color: "#333",
              flex: 1,
              textAlign: collapsed ? "center" : "left",
            }}
          >
            {collapsed ? "•" : p.title}
          </Link>

          {!collapsed && (
            <button
              onClick={() => deleteProject(p._id)}
              style={{
                color: "red",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                marginLeft: "6px",
              }}
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
