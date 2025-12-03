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
// GET ALL PROJECTS
// ----------------------------
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await db.collection("projects").find().toArray();
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch projects." });
  }
});

// ----------------------------
// CREATE NEW PROJECT
// ----------------------------
app.post("/api/projects", async (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "Project title is required." });
  }

  try {
    const result = await db.collection("projects").insertOne({
      title,
      createdAt: new Date(),
    });

    res.json({
      _id: result.insertedId,
      title,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create project." });
  }
});

// ----------------------------
// GET ONE PROJECT BY ID
// ----------------------------
app.get("/api/projects/:projectId", async (req, res) => {
  const { projectId } = req.params;

  if (!ObjectId.isValid(projectId)) {
    return res.status(400).json({ error: "Invalid project ID." });
  }

  try {
    const project = await db
      .collection("projects")
      .findOne({ _id: new ObjectId(projectId) });

    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch project." });
  }
});

// ----------------------------
// GET ALL DECKS IN A PROJECT
// ----------------------------
app.get("/api/projects/:projectId/decks", async (req, res) => {
  const { projectId } = req.params;

  if (!ObjectId.isValid(projectId)) {
    return res.status(400).json({ error: "Invalid project ID." });
  }

  try {
    const decks = await db
      .collection("decks")
      .find({ projectId: new ObjectId(projectId) })
      .toArray();

    res.json(decks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch decks for project." });
  }
});

// ================================================================
// DECK ROUTES
// ================================================================

// ----------------------------
// GET ALL DECKS (GLOBAL)
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
// CREATE NEW DECK (UPDATED FOR PROJECT)
// ----------------------------
app.post("/api/decks", async (req, res) => {
  const { title, projectId } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "Deck title is required." });
  }

  if (!projectId || !ObjectId.isValid(projectId)) {
    return res.status(400).json({ error: "Valid projectId is required." });
  }

  try {
    const result = await db.collection("decks").insertOne({
      title,
      projectId: new ObjectId(projectId),
      createdAt: new Date(),
    });

    res.json({
      _id: result.insertedId,
      title,
      projectId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create deck." });
  }
});

// ----------------------------
// GET SINGLE DECK BY ID
// ----------------------------
app.get("/api/decks/:deckId", async (req, res) => {
  const { deckId } = req.params;

  if (!ObjectId.isValid(deckId)) {
    return res.status(400).json({ error: "Invalid deck ID." });
  }

  try {
    const deck = await db
      .collection("decks")
      .findOne({ _id: new ObjectId(deckId) });

    if (!deck) {
      return res.status(404).json({ error: "Deck not found." });
    }

    res.json(deck);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch deck." });
  }
});

// ----------------------------
// UPDATE DECK (TITLE + CARDS)
// ----------------------------
app.put("/api/decks/:deckId", async (req, res) => {
  const { deckId } = req.params;
  const { title, cards } = req.body;

  if (!ObjectId.isValid(deckId)) {
    return res.status(400).json({ error: "Invalid deck ID." });
  }

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "Deck title is required." });
  }

  if (!Array.isArray(cards)) {
    return res.status(400).json({ error: "Cards must be an array." });
  }

  try {
    const deckObjectId = new ObjectId(deckId);

    // 1) Update deck title
    await db
      .collection("decks")
      .updateOne({ _id: deckObjectId }, { $set: { title } });

    // 2) Remove existing cards for this deck
    await db.collection("cards").deleteMany({ deckId: deckObjectId });

    // 3) Insert new cards
    const docsToInsert = cards
      .filter(
        (c) =>
          c.frontText &&
          c.backText &&
          c.frontText.trim() !== "" &&
          c.backText.trim() !== ""
      )
      .map((c) => ({
        deckId: deckObjectId,
        frontText: c.frontText,
        backText: c.backText,
        createdAt: new Date(),
      }));

    if (docsToInsert.length > 0) {
      await db.collection("cards").insertMany(docsToInsert);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error updating deck:", err);
    res.status(500).json({ error: "Failed to update deck." });
  }
});

// ----------------------------
// DELETE DECK
// ----------------------------
app.delete("/api/decks/:deckId", async (req, res) => {
  const { deckId } = req.params;

  if (!ObjectId.isValid(deckId)) {
    return res.status(400).json({ error: "Invalid deck ID." });
  }

  try {
    await db.collection("decks").deleteOne({ _id: new ObjectId(deckId) });

    // Also delete its cards
    await db.collection("cards").deleteMany({ deckId: new ObjectId(deckId) });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete deck." });
  }
});

// ================================================================
// CARD ROUTES
// ================================================================

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

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
