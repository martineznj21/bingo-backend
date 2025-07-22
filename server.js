// server.js
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
	origin: 'https://martineznj21.github.io',
	methods: ['GET', 'POST', 'DELETE']
}));
app.use(express.json());

let currentGame = 1; //Default game number
let drawnNumbers = [];
let cardRegistry = {};

app.get("/api/game", (req, res) => {
  res.json({ currentGame });
});

app.post("/api/game", (req, res) => {
  const { game } = req.body;
  const parsed = parseInt(game, 10);
  if (!isNaN(parsed) && parsed >= 1 && parsed <= 10) {
    currentGame = parsed;
    res.status(200).json({ success: true, currentGame });
  } else {
    res.status(400).json({ success: false, message: "Invalid game number" });
  }
});

// Get all drawn numbers
app.get("/api/draws", (req, res) => {
  res.json(drawnNumbers);
});

// Add a drawn number
app.post("/api/draws", (req, res) => {
  let { number } = req.body;
  number = Number(number);

  if (!isNaN(number) && !drawnNumbers.includes(number)) {
    drawnNumbers.push(number);
    res.status(201).json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
});


// Reset the draw list
app.delete("/api/draws", (req, res) => {
  drawnNumbers = [];
  res.json({ success: true });
});

// Register a card
app.post("/api/cards", (req, res) => {
  const { code, numbers } = req.body;
  if (code && Array.isArray(numbers)) {
    cardRegistry[code] = numbers;
    res.status(201).json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
});

// Get card by code
app.get("/api/cards/:code", (req, res) => {
  const code = req.params.code;
  if (cardRegistry[code]) {
    res.json({ code, numbers: cardRegistry[code] });
  } else {
    res.status(404).json({ error: "Card not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
