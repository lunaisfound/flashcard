export default function EditorList({ title, deck, startEditing }) {
  return (
    <div>
      <h2>{title}</h2>
      {Array.isArray(deck) && deck.length === 0 && <p>No cards yet.</p>}

      {Array.isArray(deck) &&
        deck.map((card, i) => (
          <div key={i} style={{ marginBottom: "8px" }}>
            <strong>Card {i + 1}</strong>{" "}
            <span>
              ({card.frontText} → {card.backText})
            </span>
            <button
              onClick={() => startEditing(i)}
              style={{ marginLeft: "10px" }}
            >
              Edit
            </button>
          </div>
        ))}
    </div>
  );
}
