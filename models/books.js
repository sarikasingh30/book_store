const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    publishedYear: { type: Number, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    coverImage: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    isAvailable: { type: Boolean, default: true },
    genre: { type: String },
    language: { type: String, default: "English" },
    stock: { type: Number, default: 0 },
    categories: [{ type: String, required: true }],
    ratings: { type: Number, min: 0, max: 5, default: 0 },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        comment: String,
        rating: Number,
      },
    ],
  },
  {
    timestamps: { createdAt: "dateAdded", updatedAt: "dateUpdated" },
  }
);

module.exports = mongoose.model("book", bookSchema);
