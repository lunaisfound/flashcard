import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function ProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [decks, setDecks] = useState([]);
  const [newDeckTitle, setNewDeckTitle] = useState("");
  const [loading, setLoading] = useState(true);

  async function deleteProject() {
    const ok = window.confirm("Delete this entire project?");
    if (!ok) return;

    const res = await fetch(`/api/projects/${projectId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      alert("Failed to delete project");
      return;
    }

    // Go back home
    navigate("/");
  }

  // Load project + decks

  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch(`/api/projects/${projectId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load project");
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error(err);
      }
    }

    async function loadDecks() {
      try {
        const res = await fetch(`/api/projects/${projectId}/decks`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load decks");
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.warn("Expected array of decks but got:", data);
          throw new Error("Invalid response format");
        }

        setDecks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
    loadDecks();
  }, [projectId]);

  // Create Deck

  async function createDeck() {
    if (!newDeckTitle.trim()) return;

    try {
      const res = await fetch("/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: newDeckTitle.trim(),
          projectId,
        }),
      });

      if (!res.ok) throw new Error("Failed to create deck");

      const deck = await res.json();

      setDecks((prev) => [...prev, deck]);
      setNewDeckTitle("");
    } catch (err) {
      console.error("Failed to create deck:", err);
      alert("Error creating deck.");
    }
  }

  // Delete Deck

  async function deleteDeck(deckId) {
    const confirmed = window.confirm("Delete this deck?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/decks/${deckId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete deck");

      setDecks((prev) => prev.filter((d) => d._id !== deckId));
    } catch (err) {
      console.error("Failed to delete deck:", err);
      alert("Error deleting deck.");
    }
  }

  // Render

  if (loading) return <p>Loading project...</p>;
  if (!project) return <p>Project not found.</p>;

  return (
    <div>
      <h1>{project.title}</h1>

      {/* Delete project button */}
      <button
        onClick={deleteProject}
        style={{
          marginBottom: "20px",
          background: "white",
          border: "1px solid red",
          color: "red",
          borderRadius: "6px",
          padding: "6px 12px",
          cursor: "pointer",
        }}
      >
        Delete Project
      </button>

      {/* Create Deck */}
      <div style={{ marginBottom: "20px" }}>
        <input
          value={newDeckTitle}
          onChange={(e) => setNewDeckTitle(e.target.value)}
          placeholder="New deck title"
          style={{
            padding: "8px",
            marginRight: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={createDeck}
          style={{
            padding: "8px 14px",
            background: "#0077ff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          + Add Deck
        </button>
      </div>

      {/* List of Decks */}
      <div>
        {Array.isArray(decks) &&
          decks.map((deck) => (
            <div
              key={deck._id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px",
                borderRadius: "6px",
                background: "#fff",
                border: "1px solid #ddd",
                marginBottom: "10px",
              }}
            >
              <Link
                to={`/app/decks/${deck._id}`}
                style={{ textDecoration: "none", color: "#333", flex: 1 }}
              >
                {deck.title}
              </Link>

              <button
                onClick={() => deleteDeck(deck._id)}
                style={{
                  marginLeft: "10px",
                  color: "red",
                  border: "1px solid red",
                  background: "white",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
