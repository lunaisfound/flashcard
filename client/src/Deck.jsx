import { FlashcardArray } from "react-quizlet-flashcard";
import "react-quizlet-flashcard/dist/index.css";
import { useEffect, useState } from "react";

export default function FlashDeck() {
  const [deck, setDeck] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/...")//im not sure about the location
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
      <FlashcardArray deck={deck} />
    </div>
  );
}
