import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 4000;
const DATA_FILE = path.resolve("./favorites.json");

app.use(cors());
app.use(bodyParser.json());

// load existing favorites or start empty
let favorites = [];
if (fs.existsSync(DATA_FILE)) {
  favorites = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function saveFavorites() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(favorites, null, 2));
}

// GET all
app.get("/api/favorites", (req, res) => {
  res.json(favorites);
});

// POST new
app.post("/api/favorites", (req, res) => {
  const show = req.body;
  if (!show.id || !show.name) {
    return res.status(400).json({ error: "id and name required" });
  }
  if (favorites.find((f) => f.id === show.id)) {
    return res.status(409).json({ error: "Already in favorites" });
  }
  favorites.push(show);
  saveFavorites();
  res.status(201).json(show);
});

// DELETE one
app.delete("/api/favorites/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = favorites.findIndex((f) => f.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Not found" });
  }
  const [removed] = favorites.splice(idx, 1);
  saveFavorites();
  res.json(removed);
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
