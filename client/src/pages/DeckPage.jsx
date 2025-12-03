import { FlashcardArray } from "react-quizlet-flashcard";
import "react-quizlet-flashcard/dist/index.css";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function DeckPage() {
  const { deckId } = useParams();
  const [deckCards, setDeckCards] = useState([]);
  const [deckTitle, setDeckTitle] = useState("");

  // Fetch deck title (from decks collection)
  useEffect(() => {
    fetch("/api/decks")
      .then((res) => res.json())
      .then((allDecks) => {
        const deck = allDecks.find((d) => d._id === deckId);
        if (deck) setDeckTitle(deck.title);
      });
  }, [deckId]);

  // Fetch cards for this deck
  useEffect(() => {
    fetch(`/api/cards/${deckId}`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((card) => ({
          front: { html: <div>{card.frontText}</div> },
          back: { html: <div>{card.backText}</div> },
        }));
        setDeckCards(formatted);
      });
  }, [deckId]);

  return (
    <div>
      <h1>{deckTitle}</h1>

      {deckCards.length === 0 ? (
        <p>No cards yet.</p>
      ) : (
        <FlashcardArray deck={deckCards} />
      )}

      <br />
      <Link to={`/decks/${deckId}/edit`}>
        <button>Edit Deck</button>
      </Link>
    </div>
  );
}
