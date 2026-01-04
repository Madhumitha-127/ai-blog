import express from "express";

const router = express.Router();

router.post("/summary", async (req, res) => {
  try {
    const { content } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        summary: "⚠️ AI not configured. Add OPENAI_API_KEY to enable."
      });
    }

    const OpenAI = (await import("openai")).default;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Summarize this blog in 2-3 lines:\n${content}`
        }
      ]
    });

    res.json({
      summary: response.choices[0].message.content
    });
  } catch (error) {
    console.error("AI ERROR:", error);
    res.status(500).json({ summary: "AI failed to generate summary" });
  }
});

export default router;
