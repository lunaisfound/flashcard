import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function DashboardPage() {
  // State to store list of projects fetched from backend
  const [projects, setProjects] = useState([]);
  // State for the input field when creating a new project
  const [newTitle, setNewTitle] = useState("");
  // Loading state to handle UI while fetching data
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all projects when component mounts
    async function loadProjects() {
      try {
        const res = await fetch("/api/projects", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load projects");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error(err);
        alert("Error loading projects.");
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  async function createProject() {
    if (!newTitle.trim()) return;
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: newTitle }),
      });
      if (!res.ok) throw new Error("Failed to create project");
      const newProject = await res.json();
      setProjects((prev) => [...prev, newProject]);
      setNewTitle("");
      navigate(`/app/projects/${newProject._id}`);
    } catch (err) {
      console.error(err);
      alert("Error creating project.");
    }
  }

  if (loading) return <p>Loading your projects...</p>;

  return (
    <div>
      <h1>Your Projects</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New project title"
          style={{
            padding: "8px",
            marginRight: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <button onClick={createProject}>+ Create Project</button>
      </div>
      {/* Conditional rendering: show message if no projects exist */}
      {projects.length === 0 ? (
        <p>No projects yet. Create one to get started!</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project._id}>
              <Link to={`/app/projects/${project._id}`}>{project.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
