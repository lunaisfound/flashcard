export default function EditorList({ deck, startEditing }) {
  return (
    <div>
      <h2>{deck.title}</h2>
      {deck.length === 0 && <p>No cards yet.</p>}

      {deck.map((card, i) => (
        <div key={i} style={{ marginBottom: "8px" }}>
          <strong>Card {i + 1}</strong>
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
