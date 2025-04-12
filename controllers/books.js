const Books = require("../models/books");

module.exports.postABook = async (req, res) => {
  // const bookData = req.body;
  try {
    const {
      title,
      author,
      publishedYear,
      price,
      description,
      genre,
      language,
      stock,
      categories,
    } = req.body;

    const newBook = new Books({
      title,
      author,
      publishedYear,
      price,
      description,
      genre,
      language,
      stock,
      categories: categories ? categories.split(",") : [],
      coverImage: {
        url: req.file.path,
        public_id: req.file.filename,
      },
    });

    await newBook.save();
    res
      .status(201)
      .json({ message: "Book created successfully", book: newBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create book" });
  }
};

module.exports.getAllBooks = async (req, res) => {
  try {
    const books = await Books.find().populate({
      path: "reviews.user",
      strictPopulate: false,
    }); // reviews.user becoz its nested one;
    if (!books) {
      return res.status(404).send("No Data Found");
    }
    res.status(200).json(books);
  } catch (error) {
    console.log("error", error);
    res.status(500).send("An error occurred while getting books");
  }
};

module.exports.getABook = async (req, res) => {
  //console.log(req.params.id);
  const id = req.params.id;
  try {
    const book = await Books.findById(id).populate({
      path: "reviews.user",
      strictPopulate: false,
    }); // reviews.user becoz its nested one
    if (!book) {
      return res.status(404).send("book not found");
    }
    res.status(200).json(book);
  } catch (error) {
    console.log("error", error);
    res.status(500).send("An error occurred while getting the book");
  }
};

module.exports.topRated = async (req, res) => {
  try {
    const topBooks = await Books.find().sort({ rating: -1 }).limit(6);
    res.status(200).json(topBooks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch top-rated books" });
  }
};

module.exports.updateABook = async (req, res) => {
  const id = req.params.id;
  const book = req.body;
  try {
    const done = await Books.findByIdAndUpdate(id, book, { new: true });
    if (!done) {
      return res.status(404).send("Book not found");
    }
    res.status(200).send("Book updated successfully");
  } catch (error) {
    console.log("error", error);
    res.status(500).send("An error occurred while updating the book");
  }
};
module.exports.deleteABook = async (req, res) => {
  const id = req.params.id;
  try {
    await Books.findByIdAndDelete(id);
    res.status(200).send("book deleted successfully");
  } catch (error) {
    console.log("error", error);
    res.status(500).send("An error occurred while deleting the book");
  }
};
