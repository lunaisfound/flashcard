import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// helper to generate client-side IDs for cards
const genId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

function createEmptyCard() {
  return { id: genId(), frontText: "", backText: "" };
}

export default function EditDeckPage() {
  const { deckId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load deck title and cards

  useEffect(() => {
    async function loadDeckAndCards() {
      try {
        const deckRes = await fetch(`/api/decks/${deckId}`, {
          credentials: "include",
        });
        if (!deckRes.ok) throw new Error("Failed to load deck");
        const deck = await deckRes.json();
        setTitle(deck.title || "");

        const cardsRes = await fetch(`/api/cards/${deckId}`, {
          credentials: "include",
        });
        if (!cardsRes.ok) throw new Error("Failed to load cards");
        const cardDocs = await cardsRes.json();

        if (!Array.isArray(cardDocs)) {
          throw new Error("Invalid cards response format");
        }

        const formatted = cardDocs.map((c) => ({
          id: c._id?.toString() || genId(),
          frontText: c.frontText || "",
          backText: c.backText || "",
        }));

        setCards(formatted);
      } catch (err) {
        console.error(err);
        alert("Error loading deck for editing.");
      } finally {
        setLoading(false);
      }
    }

    loadDeckAndCards();
  }, [deckId]);

  // Handlers for editing

  function updateCardText(id, field, value) {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, [field]: value } : card)),
    );
  }

  function addNewCard() {
    setCards((prev) => [...prev, createEmptyCard()]);
  }

  function deleteCard(id) {
    setCards((prev) => prev.filter((card) => card.id !== id));
  }

  // Save handler (PUT /api/decks/:deckId)

  async function handleSave(e) {
    e.preventDefault();

    // Check title
    if (!title.trim()) {
      alert("Deck title cannot be empty.");
      return;
    }

    // Remove empty cards
    const validCards = cards.filter(
      (c) => c.frontText.trim() !== "" && c.backText.trim() !== "",
    );

    // Make sure at least 1 card exists
    if (validCards.length === 0) {
      alert(
        "You must have at least one card with both front and back filled in.",
      );
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: title.trim(),

        // Only send valid cards
        cards: validCards.map((c) => ({
          frontText: c.frontText.trim(),
          backText: c.backText.trim(),
        })),
      };
      console.log("Saving payload:", payload);

      const res = await fetch(`/api/decks/${deckId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to save deck");
      }

      // Go back to deck view
      navigate(`/app/decks/${deckId}`);
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving deck changes.");
    } finally {
      setSaving(false);
    }
  }

  // Render

  if (loading) {
    return <p>Loading deck...</p>;
  }

  return (
    <div>
      <h1>Edit Deck</h1>

      <form onSubmit={handleSave}>
        {/* Deck title */}
        <div style={{ marginBottom: "20px" }}>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ marginLeft: "10px", width: "300px" }}
            />
          </label>
        </div>

        {/* Card list */}
        {cards.map((card, index) => (
          <div
            key={card.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>Card {index + 1}</h3>
            <div style={{ marginBottom: "8px" }}>
              <label>
                Front:
                <input
                  type="text"
                  value={card.frontText}
                  onChange={(e) =>
                    updateCardText(card.id, "frontText", e.target.value)
                  }
                  style={{ marginLeft: "10px", width: "300px" }}
                />
              </label>
            </div>
            <div style={{ marginBottom: "8px" }}>
              <label>
                Back:
                <input
                  type="text"
                  value={card.backText}
                  onChange={(e) =>
                    updateCardText(card.id, "backText", e.target.value)
                  }
                  style={{ marginLeft: "10px", width: "300px" }}
                />
              </label>
            </div>
            <button
              type="button"
              onClick={() => deleteCard(card.id)}
              style={{ color: "red" }}
            >
              Delete card
            </button>
          </div>
        ))}

        <button type="button" onClick={addNewCard}>
          + Add card
        </button>

        <div style={{ marginTop: "20px" }}>
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Done"}
          </button>
        </div>
      </form>
    </div>
  );
}
