require("dotenv").config();
const uri = process.env.MONGO_URI;

const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const client = new MongoClient(uri);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("flashcards");
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}
connectDB();

// ----------------------------
// SIMPLE TEST ROUTE
// ----------------------------
app.get("/", (req, res) => {
  res.send("Server is running.");
});

// ----------------------------
// GET ALL DECKS
// ----------------------------
app.get("/api/decks", async (req, res) => {
  try {
    const decks = await db.collection("decks").find().toArray();
    res.json(decks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch decks." });
  }
});

// ----------------------------
// CREATE NEW DECK
// ----------------------------
app.post("/api/decks", async (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "Deck title is required." });
  }

  try {
    const result = await db.collection("decks").insertOne({
      title,
      createdAt: new Date(),
    });

    res.json({
      _id: result.insertedId,
      title,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create deck." });
  }
});

// ----------------------------
// GET ALL CARDS IN A DECK
// ----------------------------
app.get("/api/cards/:deckId", async (req, res) => {
  const { deckId } = req.params;

  if (!ObjectId.isValid(deckId)) {
    return res.status(400).json({ error: "Invalid deck ID." });
  }

  try {
    const cards = await db
      .collection("cards")
      .find({ deckId: new ObjectId(deckId) })
      .toArray();

    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cards." });
  }
});

// ----------------------------
// CREATE NEW CARD
// ----------------------------
app.post("/api/cards", async (req, res) => {
  const { deckId, frontText, backText } = req.body;

  if (!deckId || !frontText || !backText) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  if (!ObjectId.isValid(deckId)) {
    return res.status(400).json({ error: "Invalid deck ID." });
  }

  try {
    const result = await db.collection("cards").insertOne({
      deckId: new ObjectId(deckId),
      frontText,
      backText,
      createdAt: new Date(),
    });

    res.json({
      _id: result.insertedId,
      deckId,
      frontText,
      backText,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create card." });
  }
});

// ----------------------------
// START SERVER
// ----------------------------
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
