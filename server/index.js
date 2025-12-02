require("dotenv").config();
const uri = process.env.MONGO_URI;

const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

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

// Test route to confirm everything works
app.get("/", (req, res) => {
  res.send("Server is running.");
});

// Example route to test DB connection
app.get("/api/test-db", async (req, res) => {
  try {
    const collections = await db.listCollections().toArray();
    res.json({
      message: "Success! Connected to MongoDB.",
      collections,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
