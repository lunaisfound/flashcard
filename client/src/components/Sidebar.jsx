import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [projects, setProjects] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const navigate = useNavigate();

  // Load all projects
  useEffect(() => {
    fetch("http://localhost:4000/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Failed to load projects:", err));
  }, []);

  async function createProject() {
    if (!newTitle.trim()) return;

    try {
      const res = await fetch("http://localhost:4000/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });

      const proj = await res.json();
      setProjects([...projects, proj]);
      setNewTitle("");
      navigate(`/projects/${proj._id}`);
    } catch (err) {
      console.error("Failed to create project:", err);
    }
  }

  return (
    <div
      style={{
        width: "260px",
        height: "100vh",
        background: "#f7f5f3",
        padding: "20px",
        borderRight: "1px solid #ddd",
        boxSizing: "border-box",
        position: "fixed",
        left: 0,
        top: 0,
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <h2 style={{ margin: "0 0 20px", fontWeight: "bold" }}>Projects</h2>

      {/* Add Project */}
      <div style={{ marginBottom: "20px" }}>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New project name"
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "8px",
          }}
        />
        <button
          onClick={createProject}
          style={{
            width: "100%",
            padding: "8px",
            background: "#db4c3f",
            border: "none",
            borderRadius: "6px",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          + Add Project
        </button>
      </div>

      {/* Project list */}
      <div>
        {projects.map((p) => (
          <Link
            key={p._id}
            to={`/projects/${p._id}`}
            style={{
              display: "block",
              padding: "10px 12px",
              borderRadius: "6px",
              textDecoration: "none",
              color: "#333",
              marginBottom: "6px",
              background: "#fff",
              border: "1px solid #eee",
            }}
          >
            {p.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
