const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

require("dotenv").config();
const uri = process.env.MONGO_URI;

const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allow cookies to be sent
  }),
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

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

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await db.collection("users").findOne({ email });

        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });
    done(null, user); // This becomes req.user
  } catch (err) {
    done(err);
  }
});

// SIMPLE TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server is running.");
});

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Unauthorized" });
}

// LOGIN
app.post("/api/login", passport.authenticate("local"), (req, res) => {
  res.json({
    success: true,
    message: "Logged in successfully",
    user: {
      _id: req.user._id,
      email: req.user.email,
    },
  });
});

// REGISTER
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    // Check if user already exists
    const existing = await db.collection("users").findOne({ email });

    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    res.json({
      success: true,
      userId: result.insertedId,
      email,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// GET ALL PROJECTS

app.get("/api/projects", ensureAuth, async (req, res) => {
  try {
    const projects = await db
      .collection("projects")
      .find({ userId: req.user._id })
      .toArray();
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch projects." });
  }
});

// CREATE NEW PROJECT

app.post("/api/projects", ensureAuth, async (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "Project title is required." });
  }

  try {
    const result = await db.collection("projects").insertOne({
      title,
      createdAt: new Date(),
      userId: req.user._id,
    });

    res.json({
      _id: result.insertedId,
      title,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create project." });
  }
});

// GET ONE PROJECT BY ID

app.get("/api/projects/:projectId", ensureAuth, async (req, res) => {
  const { projectId } = req.params;

  if (!ObjectId.isValid(projectId)) {
    return res.status(400).json({ error: "Invalid project ID." });
  }

  try {
    const project = await db
      .collection("projects")
      .findOne({ _id: new ObjectId(projectId), userId: req.user._id }); // covert str projectId into an ObjectId type

    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch project." });
  }
});

// GET ALL DECKS IN A PROJECT

app.get("/api/projects/:projectId/decks", ensureAuth, async (req, res) => {
  const { projectId } = req.params;

  if (!ObjectId.isValid(projectId)) {
    return res.status(400).json({ error: "Invalid project ID." });
  }

  try {
    const decks = await db
      .collection("decks")
      .find({ projectId: new ObjectId(projectId), userId: req.user._id })
      .toArray();

    res.json(decks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch decks for project." });
  }
});

// DELETE PROJECT + its decks + its cards

app.delete("/api/projects/:projectId", ensureAuth, async (req, res) => {
  const { projectId } = req.params;

  if (!ObjectId.isValid(projectId)) {
    return res.status(400).json({ error: "Invalid project ID." });
  }

  try {
    // Delete the project itself
    await db
      .collection("projects")
      .deleteOne({ _id: new ObjectId(projectId), userId: req.user._id });

    // Delete all decks in this project
    const decks = await db
      .collection("decks")
      .find({ projectId: new ObjectId(projectId) })
      .toArray();

    const deckIds = decks.map((d) => d._id);

    if (deckIds.length > 0) {
      // delete cards belonging to those decks
      await db.collection("cards").deleteMany({
        deckId: { $in: deckIds.map((id) => new ObjectId(id)) },
      });

      // delete the decks
      await db.collection("decks").deleteMany({
        _id: { $in: deckIds.map((id) => new ObjectId(id)) },
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete project:", err);
    res.status(500).json({ error: "Failed to delete project." });
  }
});

// GET ALL DECKS (GLOBAL)

app.get("/api/decks", ensureAuth, async (req, res) => {
  try {
    const decks = await db
      .collection("decks")
      .find({ userId: req.user._id })
      .toArray();
    res.json(decks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch decks." });
  }
});

// CREATE NEW DECK

app.post("/api/decks", ensureAuth, async (req, res) => {
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
      userId: req.user._id,
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

// GET SINGLE DECK BY ID

app.get("/api/decks/:deckId", ensureAuth, async (req, res) => {
  const { deckId } = req.params;

  if (!ObjectId.isValid(deckId)) {
    return res.status(400).json({ error: "Invalid deck ID." });
  }

  try {
    const deck = await db
      .collection("decks")
      .findOne({ _id: new ObjectId(deckId), userId: req.user._id });

    if (!deck) {
      return res.status(404).json({ error: "Deck not found." });
    }

    res.json(deck);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch deck." });
  }
});

// UPDATE DECK (TITLE + CARDS)

app.put("/api/decks/:deckId", ensureAuth, async (req, res) => {
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

    // only update if the deck belongs to this user
    const deck = await db.collection("decks").findOne({
      _id: deckObjectId,
      userId: req.user._id,
    });

    if (!deck) {
      return res
        .status(403)
        .json({ error: "Not authorized to edit this deck" });
    }

    // Update deck title
    await db
      .collection("decks")
      .updateOne({ _id: deckObjectId }, { $set: { title } });

    // Remove existing cards for this deck
    await db.collection("cards").deleteMany({ deckId: deckObjectId });

    // Insert new cards
    const docsToInsert = cards
      .filter(
        (c) =>
          c.frontText &&
          c.backText &&
          c.frontText.trim() !== "" &&
          c.backText.trim() !== "",
      )
      .map((c) => ({
        deckId: deckObjectId,
        frontText: c.frontText,
        backText: c.backText,
        createdAt: new Date(),
        userId: req.user._id,
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

// DELETE DECK

app.delete("/api/decks/:deckId", ensureAuth, async (req, res) => {
  const { deckId } = req.params;

  if (!ObjectId.isValid(deckId)) {
    return res.status(400).json({ error: "Invalid deck ID." });
  }

  try {
    const deckObjectId = new ObjectId(deckId);

    // Only delete if the deck belongs to this user
    const result = await db.collection("decks").deleteOne({
      _id: deckObjectId,
      userId: req.user._id,
    });

    if (result.deletedCount === 0) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this deck" });
    }

    // Also delete its cards
    await db.collection("cards").deleteMany({ deckId: new ObjectId(deckId) });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete deck." });
  }
});

// GET ALL CARDS IN A DECK

app.get("/api/cards/:deckId", ensureAuth, async (req, res) => {
  const { deckId } = req.params;

  if (!ObjectId.isValid(deckId)) {
    return res.status(400).json({ error: "Invalid deck ID." });
  }

  try {
    const cards = await db
      .collection("cards")
      .find({ deckId: new ObjectId(deckId), userId: req.user._id })
      .toArray();

    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cards." });
  }
});

// CREATE NEW CARD

app.post("/api/cards", ensureAuth, async (req, res) => {
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
      userId: req.user._id,
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
