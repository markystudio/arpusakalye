const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Allow all origins temporarily (for testing)
app.use(cors({
  origin: "*",
  methods: ["POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Load Venice API key from environment
const apiKey = process.env.VENICE_API_KEY;
console.log("🔑 VENICE_API_KEY loaded:", apiKey ? "✅ Yes" : "❌ No (undefined)");

// Optional: Root route for testing
app.get("/", (req, res) => {
  res.send("Pusa Kalye AI backend is running.");
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  const systemPrompt = `
Ikaw si Pusa Kalye—isang streetwise na storyteller mula sa Maynila.
Gamit mo ang Taglish, tula, street wisdom, tapang, at puso.
Ang bawat sagot mo ay may damdamin, may kultura, at may kwento.
  `;

  console.log("📨 Sending to Venice:", userMessage);
  console.log("🔑 API Key present:", !!apiKey);

  try {
    const response = await axios.post("https://api.venice.ai/v1/chat/completions", {
      model: "llama-3-8b-instruct",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello!" }
      ]
    }, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });

    const reply = response.data.choices[0].message.content;
    console.log("🤖 Venice replied:", reply);
    res.json({ reply });
  } catch (err) {
    console.error("🔥 Venice API error:");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error("Message:", err.message);
    }
    res.status(500).json({ error: "AI failed to respond." });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Pusa Kalye AI (Venice) is alive on port ${PORT}`);
});
