import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ProjectPage() {
  const [deckList, setDeckList] = useState([]);

  const [newDeckTitle, setNewDeckTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetch("/api/decks")
      .then((res) => res.json())
      .then((data) => setDeckList(data))
      .catch((err) => console.error("Failed to fetch decks", err));
  }, []);

  function startCreatingDeck() {
    setIsCreating(true);
  }

  function submitNewDeck() {
    if (!newDeckTitle.trim()) return;

    const newDeck = {
      _id: Math.random().toString(),
      title: newDeckTitle.trim(),
    };

    setDeckList((prev) => [...prev, newDeck]);

    setNewDeckTitle("");
    setIsCreating(false);
  }

  return (
    <div>
      <h1>Decks</h1>
      <ul>
        {deckList.map((deck) => (
          <li key={deck._id}>
            <Link to={`/decks/${deck._id}`}>{deck.title}</Link>
          </li>
        ))}
      </ul>

      <button onClick={startCreatingDeck}>+ Add Deck</button>

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
