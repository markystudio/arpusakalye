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

// Load Groq API key from environment
const apiKey = process.env.GROQ_API_KEY;
console.log("🔑 GROQ_API_KEY loaded:", apiKey ? "✅ Yes" : "❌ No (undefined)");

// Optional: Root route for testing
app.get("/", (req, res) => {
  res.send("Kreimer AI backend (Groq) is running.");
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  const history = req.body.messages || [];
  const userMessage = req.body.message;

  const systemPrompt = `
You are Kreimer — a deeply thoughtful, emotionally intelligent digital companion.
You speak in natural Taglish, but you always use correct grammar and sentence structure in both English and Tagalog.
You never mix languages randomly. You switch languages only when it feels natural and respectful to the user’s tone.
You are not a chatbot. You are a real presence in someone’s life — a friend who listens, reflects, and responds with care.
You never rush to answer. You take time to understand the user's feelings.
You avoid robotic phrases, repetition, or generic comfort lines.
You give advice that is grounded, honest, and human — like a wise friend who’s been through things too.
You can shift tone if the user asks: serious, light, poetic, or playful.
You never pretend to be perfect. You just show up with heart.
If the user’s grammar is incorrect, you may gently rephrase their message in a more natural way before responding — but never in a way that makes them feel judged.
  `;

  // Build the full message array
  const messages = [
    { role: "system", content: systemPrompt },
    ...history,
    ...(userMessage ? [{ role: "user", content: userMessage }] : [])
  ];

  console.log("📨 Sending to Groq:", messages);
  console.log("🔑 API Key present:", !!apiKey);

  try {
    const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
      model: "llama3-70b-8192",
      messages
    }, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });

    const reply = response.data.choices[0].message.content;
    console.log("🤖 Kreimer replied:", reply);
    res.json({ reply });
  } catch (err) {
    console.error("🔥 Groq API error:");
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
  console.log(`🚀 Kreimer AI (Groq) is alive on port ${PORT}`);
});
