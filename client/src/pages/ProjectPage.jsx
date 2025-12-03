import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ProjectPage() {
  const [deckList, setDeckList] = useState([]);

  const [newDeckTitle, setNewDeckTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // -----------------------
  // Fetch all decks
  // -----------------------
  useEffect(() => {
    fetch("/api/decks")
      .then((res) => res.json())
      .then((data) => setDeckList(data))
      .catch((err) => console.error("Failed to fetch decks", err));
  }, []);

  // -----------------------
  // Create Deck UI handler
  // -----------------------
  function startCreatingDeck() {
    setIsCreating(true);
  }

  // -----------------------
  // Submit new deck to backend
  // -----------------------
  async function submitNewDeck() {
    if (!newDeckTitle.trim()) return;

    try {
      const res = await fetch("/api/decks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newDeckTitle.trim() }),
      });

      if (!res.ok) throw new Error("Failed to create deck");

      const createdDeck = await res.json(); // returns {_id, title}

      // Update UI
      setDeckList((prev) => [...prev, createdDeck]);

      // Reset form
      setNewDeckTitle("");
      setIsCreating(false);
    } catch (err) {
      console.error("Error creating deck:", err);
      alert("Server error. Deck not created.");
    }
  }

  // -----------------------
  // Delete Deck
  // -----------------------
  async function deleteDeck(deckId) {
    const confirmed = window.confirm("Delete this deck?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/decks/${deckId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete deck");

      // Update frontend state
      setDeckList((prev) => prev.filter((deck) => deck._id !== deckId));
    } catch (err) {
      console.error("Error deleting deck:", err);
      alert("Error deleting deck.");
    }
  }

  return (
    <div>
      <h1>Decks</h1>

      <ul>
        {deckList.map((deck) => (
          <li key={deck._id} style={{ marginBottom: "8px" }}>
            <Link to={`/decks/${deck._id}`}>{deck.title}</Link>

            {/* DELETE BUTTON */}
            <button
              style={{
                marginLeft: "10px",
                color: "red",
                border: "1px solid red",
                background: "white",
                cursor: "pointer",
              }}
              onClick={() => deleteDeck(deck._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Add Deck Button */}
      <button onClick={startCreatingDeck}>+ Add Deck</button>

      {/* Deck Creation Form */}
      {isCreating && (
        <div style={{ marginTop: "10px" }}>
          <input
            type="text"
            placeholder="Deck title"
            value={newDeckTitle}
            onChange={(e) => setNewDeckTitle(e.target.value)}
          />
          <button onClick={submitNewDeck}>Create</button>
          <button onClick={() => setIsCreating(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
