import { Flashcard } from "react-quizlet-flashcard";
import "react-quizlet-flashcard/dist/index.css";
import { useEffect, useState } from "react";

export default function Project() {
  let deckList = [];
  useEffect(() => {
    fetch("http://localhost:5000/...") //im not sure about where or what to fetch
      .then((res) => res.json())
      .then((data) => {
        deckList.push(data);
      });
  }, [deckList]);

  return (
    <ul>
      {deckList.map((item, index) => (
        <li key={index}>
          <link href="...">{item}</link>{" "}
          {/* I want when user clicks on the deck (preview with only the deck's title) it show that deck in full */}
        </li>
      ))}
    </ul>
  );
}
