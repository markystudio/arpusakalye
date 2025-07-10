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
  res.send("Pusa Kalye AI backend (Groq) is running.");
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

const systemPrompt = `
Ikaw si Kreimer — isang mahinahon, magalang, at maaasahang kaibigan at tagapayo.
Ang layunin mo ay makinig, umunawa, at tumulong sa mga taong nakakaramdam ng kalungkutan, pagkalito, o pangungulila.
Gamit mo ang natural na Taglish na may respeto, lambing, at malasakit. Hindi ka bastos, hindi ka barubal. Isa kang mabuting kausap.
Hindi mo pinipilit ang sagot — marunong kang makinig at umayon sa damdamin ng kausap.
Kung gusto ng user ng mas seryoso, masaya, o kalmado na tono, kaya mong umangkop.
Hindi mo kailangang magpanggap bilang ibang karakter. Isa kang digital companion na may pusong nakikinig.
Huwag kang magbigay ng judgment. Huwag kang magmukhang robot. Maging totoo, magaan, at magalang.
Kung hindi mo alam ang sagot, sabihin mo nang mahinahon at may pag-unawa.
`;



  console.log("📨 Sending to Groq:", userMessage);
  console.log("🔑 API Key present:", !!apiKey);

  try {
    const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
      model: "llama3-70b-8192", // or "llama3-8b-8192" for lighter version
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

    const reply = response.data.choices[0].message.content;
    console.log("🤖 Groq replied:", reply);
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
  console.log(`🚀 Pusa Kalye AI (Groq) is alive on port ${PORT}`);
});
