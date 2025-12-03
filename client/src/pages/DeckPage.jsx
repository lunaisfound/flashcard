import { FlashcardArray } from "react-quizlet-flashcard";
import "react-quizlet-flashcard/dist/index.css";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function DeckPage() {
  const { deckId } = useParams();
  const [deckTitle, setDeckTitle] = useState("");
  const [deckCards, setDeckCards] = useState([]);

  // ------------------------------
  // Fetch deck title (from /api/decks)
  // ------------------------------
  useEffect(() => {
    fetch("/api/decks")
      .then((res) => res.json())
      .then((decks) => {
        const deck = decks.find((d) => d._id === deckId);
        if (deck) setDeckTitle(deck.title);
      })
      .catch((err) => console.error("Failed to load deck title", err));
  }, [deckId]);

  // ------------------------------
  // Fetch cards for this deck
  // ------------------------------
  useEffect(() => {
    fetch(`/api/cards/${deckId}`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((card) => ({
          front: { html: <div>{card.frontText}</div> },
          back: { html: <div>{card.backText}</div> },
        }));
        setDeckCards(formatted);
      })
      .catch((err) => console.error("Failed to load deck cards", err));
  }, [deckId]);

  return (
    <div>
      {/* Deck Title */}
      <h1>{deckTitle || "Untitled Deck"}</h1>

      {/* Card list / Flashcards */}
      {deckCards.length === 0 ? (
        <p>No cards yet.</p>
      ) : (
        <FlashcardArray deck={deckCards} />
      )}

      {/* Edit Deck Button */}
      <div style={{ marginTop: "20px" }}>
        <Link to={`/decks/${deckId}/edit`}>
          <button>Edit Deck</button>
        </Link>
      </div>
    </div>
  );
}
