import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ProjectPage() {
  const [deckList, setDeckList] = useState([]);

  useEffect(() => {
    fetch("/api/decks")
      .then((res) => res.json())
      .then((data) => setDeckList(data))
      .catch((err) => console.error("Failed to fetch decks", err));
  }, []);

  return (
    <ul>
      {deckList.map((deck) => (
        <li key={deck._id}>
          <Link to={`/decks/${deck._id}`}>{deck.title}</Link>
        </li>
      ))}
    </ul>
  );
}
