const { Book, validateBook } = require("../models/book");
const { Genre } = require("../models/genre");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");

// get all books
router.get("/", async (req, res) => {
  const books = await Book.find().select("-__v");
  res.send(books);
});

// get book by id
router.get("/:id", validateObjectId, async (req, res) => {
  const book = await Book.findById(req.params.id).select("-__v");
  if (!book)
    return res.status(404).send("The book with given Id was not found!");

  res.send(book);
});
// create book
router.post("/", [auth], async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) return res.status(400).send(error.details);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid Genre");

  const book = new Book({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });

  await book.save();

  res.send(book);
});

// update book by id
router.put("/:id", auth, async (req, res) => {
  const { error } = validateBook(res.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid Genre");

  const book = await Book.findOneAndUpdate(
    { _id: req.params.id },
    {
      title: req.body.title,
      $set: {
        genre: {
          _id: genre._id,
          name: genre.name
        }
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    },
    {
      new: true
    }
  );

  if (!book)
    return res.status(404).send("The book with given ID was not found!");

  res.send(book);
});

// delete book by id
router.delete("/:id", auth, async (req, res) => {
  const book = await Book.findByIdAndRemove(req.params.id);
  if (!book)
    return res.status(404).send("The book with given ID was not found!");

  res.send(book);
});

module.exports = router;
