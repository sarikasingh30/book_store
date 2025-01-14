const Books = require("../models/books");
module.exports.postBook = async (req, res) => {
  const bookData = req.body;
  try {
    const done=await Books.create(bookData);
    res.status(200).send("book added successfully");
  } catch (error) {
    console.log("error", error);
    res.status(500).send("An error occurred while adding the book");
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
module.exports.getOneBook = async (req, res) => {
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

module.exports.updateOneBook = async (req, res) => {
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
module.exports.deleteOneBook = async (req, res) => {
  const id = req.params.id;
  try {
    await Books.findByIdAndDelete(id);
    res.status(200).send("book deleted successfully");
  } catch (error) {
    console.log("error", error);
    res.status(500).send("An error occurred while deleting the book");
  }
};
