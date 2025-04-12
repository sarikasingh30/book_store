const Books = require("../models/books");

module.exports.check = async (req, res) => {
  const { mood } = req.body;
  try {
    // Mood match inside the categories array (case-insensitive optional)
    const books = await Books.find({
      categories: { $in: [mood] },
    });

    if (books.length === 0) {
      return res
        .status(404)
        .json({ message: `No books found for mood: ${mood}` });
    }

    res.status(200).json({
      total: books.length,
      books,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
