/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// This stays as your actual index.js on Render
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({
  origin: "*", // TEMPORARY: allows all origins
  methods: ["POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

const apiKey = process.env.VENICE_API_KEY;

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  const systemPrompt = `
Ikaw si Pusa Kalye—isang streetwise na storyteller mula sa Maynila.
Gamit mo ang Taglish, tula, street wisdom, tapang, at puso.
Ang bawat sagot mo ay may damdamin, may kultura, at may kwento.
  `;

  try {
    const response = await axios.post("https://api.venice.ai/v1/chat/completions", {
      model: "llama-3-8b-instruct",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    }, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });

    res.json({ reply: response.data.choices[0].message.content });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "AI failed to respond." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Pusa Kalye AI (Venice) is alive on port ${PORT}`);
});




// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
