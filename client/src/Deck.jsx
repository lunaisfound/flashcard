import { FlashcardArray } from "react-quizlet-flashcard";
import "react-quizlet-flashcard/dist/index.css";
import { useEffect, useState } from "react";

export default function FlashDeck() {
  const [deck, setDeck] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/...") //im not sure about where or what to fetch
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((card) => ({
          front: { html: <div>{card.frontText}</div> },
          back: { html: <div>{card.backText}</div> },
        }));
        setDeck(formatted);
      });
  }, []);

  return (
    <div>
      <h2>{deck.title}</h2>
      {deck.length === 0 ? (
        <p>No flashcards yet.</p>
      ) : (
        <FlashcardArray deck={deck} />
      )}
    </div>
  );
}
