export default function Form({
  front,
  back,
  setFront,
  setBack,
  onSubmit,
  editing,
}) {
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Front text"
        value={front}
        onChange={(e) => setFront(e.target.value)}
      />
      <br />
      <br />

      <input
        type="text"
        placeholder="Back text"
        value={back}
        onChange={(e) => setBack(e.target.value)}
      />
      <br />
      <br />

      <button type="submit">
        {editing ? "Save Changes" : "Add Flashcard"}{" "}
        {/* I don't know how this submission can be reflected in the database */}
      </button>
    </form>
  );
}
