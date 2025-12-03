// client/src/App.jsx
import { useState } from "react";
import Project from "./Project";
import Deck from "./Deck";

function App() {
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const [selectedDeckTitle, setSelectedDeckTitle] = useState("");

  function handleSelectDeck(deckId, title) {
    setSelectedDeckId(deckId);
    setSelectedDeckTitle(title);
  }

  function handleBackToList() {
    setSelectedDeckId(null);
    setSelectedDeckTitle("");
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Flashcard App</h1>

      {selectedDeckId ? (
        <>
          <button onClick={handleBackToList} style={{ marginBottom: "1rem" }}>
            ← Back to Decks
          </button>
          <Deck deckId={selectedDeckId} title={selectedDeckTitle} />
        </>
      ) : (
        <Project onSelectDeck={handleSelectDeck} />
      )}
    </div>
  );
}

export default App;
