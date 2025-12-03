import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FlashcardArray } from "react-quizlet-flashcard";
import "react-quizlet-flashcard/dist/index.css";

export default function DeckPage() {
  const { deckId } = useParams();
  const navigate = useNavigate();

  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------------
  // Fetch deck info (title + projectId)
  // -----------------------------------
  useEffect(() => {
    async function loadDeck() {
      try {
        const res = await fetch(`/api/decks/${deckId}`);
        if (!res.ok) throw new Error("Failed to load deck");
        const data = await res.json();
        setDeck(data);
      } catch (err) {
        console.error(err);
        alert("Error loading deck.");
      }
    }

    loadDeck();
  }, [deckId]);

  // -----------------------------------
  // Fetch cards
  // -----------------------------------
  useEffect(() => {
    async function loadCards() {
      try {
        const res = await fetch(`/api/cards/${deckId}`);
        if (!res.ok) throw new Error("Failed to load deck cards");
        const data = await res.json();

        const formatted = data.map((card) => ({
          front: {
            html: <div>{card.frontText}</div>,
            style: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              height: "100%",
              width: "100%",
              padding: "20px",
              fontSize: "1.5rem",
            },
          },
          back: {
            html: <div>{card.backText}</div>,
            style: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              height: "100%",
              width: "100%",
              padding: "20px",
              fontSize: "1.5rem",
            },
          },
        }));

        setCards(formatted);
      } catch (err) {
        console.error(err);
        alert("Error loading cards.");
      } finally {
        setLoading(false);
      }
    }

    loadCards();
  }, [deckId]);

  // -----------------------------------
  // Delete Deck
  // -----------------------------------
  async function handleDelete() {
    if (!window.confirm("Delete this deck?")) return;

    try {
      const res = await fetch(`/api/decks/${deckId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete deck");

      // Go back to the project page
      navigate(`/projects/${deck.projectId}`);
    } catch (err) {
      console.error(err);
      alert("Error deleting deck.");
    }
  }

  // -----------------------------------
  // Render
  // -----------------------------------
  if (loading) return <p>Loading...</p>;
  if (!deck) return <p>Deck not found.</p>;

  return (
    <div>
      {/* Title */}
      <h1>{deck.title}</h1>

      {/* Flashcards */}
      {cards.length === 0 ? (
        <p>No cards yet.</p>
      ) : (
        <FlashcardArray deck={cards} />
      )}

      {/* Buttons */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <Link to={`/decks/${deckId}/edit`}>
          <button
            style={{
              padding: "8px 14px",
              background: "#0077ff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Edit Deck
          </button>
        </Link>

        <button
          onClick={handleDelete}
          style={{
            padding: "8px 14px",
            background: "white",
            border: "1px solid red",
            borderRadius: "6px",
            color: "red",
            cursor: "pointer",
          }}
        >
          Delete Deck
        </button>
      </div>
    </div>
  );
}
