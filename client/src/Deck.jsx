// client/src/Deck.jsx
import { useEffect, useState } from "react";
import { FlashcardArray } from "react-quizlet-flashcard";
import "react-quizlet-flashcard/dist/index.css";

export default function Deck({ deckId, title }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCards() {
      try {
        const res = await fetch(`/api/cards/${deckId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch cards");
        }
        const data = await res.json();

        const formatted = data.map((card) => ({
          front: { html: <div>{card.frontText}</div> },
          back: { html: <div>{card.backText}</div> },
        }));

        setCards(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (deckId) {
      fetchCards();
    }
  }, [deckId]);

  if (loading) {
    return <p>Loading cards...</p>;
  }

  return (
    <div>
      <h2>{title}</h2>
      {cards.length === 0 ? (
        <p>No flashcards yet.</p>
      ) : (
        <FlashcardArray deck={cards} />
      )}
    </div>
  );
}
