import { FlashcardArray } from "react-quizlet-flashcard";
import "react-quizlet-flashcard/dist/index.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function DeckPage() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState([]);

  useEffect(() => {
    fetch(`/api/cards/${deckId}`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((card) => ({
          front: { html: <div>{card.frontText}</div> },
          back: { html: <div>{card.backText}</div> },
        }));
        setDeck(formatted);
      });
  }, [deckId]);

  return (
    <div>
      <FlashcardArray deck={deck} />
    </div>
  );
}
