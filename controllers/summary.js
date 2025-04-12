require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
module.exports.postSummary = async (req, res) => {
  try {
    const { title, author, publishedYear } = req.body;
    if (!title)
      return res.status(400).json({ error: "Book title is required." });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Give a concise, engaging, and reader-friendly summary (with emojis) of the book titled "${title}" by ${author}, published in ${publishedYear}. Make it interesting enough to spark curiosity and encourage someone to read the book`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ summary: text });
  } catch (error) {
    console.error("Gemini error:", error.message);
    res.status(500).json({ error: "Failed to generate summary." });
  }
};
