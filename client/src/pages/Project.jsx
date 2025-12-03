// client/src/Project.jsx
import { useEffect, useState } from "react";

export default function Project({ onSelectDeck }) {
  const [deckList, setDeckList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDecks() {
      try {
        const res = await fetch("/api/decks");
        if (!res.ok) {
          throw new Error("Failed to fetch decks");
        }
        const data = await res.json();
        setDeckList(data); // expecting array of { _id, title }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDecks();
  }, []); // run once on mount

  if (loading) {
    return <p>Loading decks...</p>;
  }

  if (deckList.length === 0) {
    return <p>No decks yet.</p>;
  }

  return (
    <ul>
      {deckList.map((deck) => (
        <li key={deck._id}>
          <button
            onClick={() => onSelectDeck(deck._id, deck.title)}
            style={{
              background: "none",
              border: "1px solid #ccc",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              marginBottom: "0.5rem",
            }}
          >
            {deck.title}
          </button>
        </li>
      ))}
    </ul>
  );
}
