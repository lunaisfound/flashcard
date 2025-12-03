import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ProjectPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [decks, setDecks] = useState([]);
  const [newDeckTitle, setNewDeckTitle] = useState("");
  const [loading, setLoading] = useState(true);

  // Load project info
  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) throw new Error("Failed to load project");
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error(err);
      }
    }

    async function loadDecks() {
      try {
        const res = await fetch(`/api/projects/${projectId}/decks`);
        if (!res.ok) throw new Error("Failed to load decks");
        const data = await res.json();
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

  async function createDeck() {
    if (!newDeckTitle.trim()) return;

    try {
      const res = await fetch("/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  async function deleteDeck(deckId) {
    const confirmed = window.confirm("Delete this deck?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/decks/${deckId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete deck");

      setDecks((prev) => prev.filter((d) => d._id !== deckId));
    } catch (err) {
      console.error("Failed to delete deck:", err);
      alert("Error deleting deck.");
    }
  }

  if (loading) {
    return <p>Loading project...</p>;
  }

  if (!project) {
    return <p>Project not found.</p>;
  }

  return (
    <div>
      <h1>{project.title}</h1>

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

      <div>
        {decks.map((deck) => (
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
              to={`/decks/${deck._id}`}
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
