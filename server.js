
import express from "express";
import OpenAI from "openai";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.json({ status: "VoloX AI backend is running" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Please enter a message."
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        error: "Message is too long."
      });
    }

    const response = await openai.responses.create({
      model: "gpt-5.5",
      instructions:
        "You are VoloX AI, a helpful, friendly and accurate AI assistant.",
      input: message.trim()
    });

    res.json({
      reply: response.output_text
    });

  } catch (error) {
    console.error("Chat request failed:", error.message);

    res.status(500).json({
      error: "VoloX AI couldn't answer right now. Please try again."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`VoloX AI server running on port ${PORT}`);
});
