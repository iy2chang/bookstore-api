const Joi = require("joi");
// Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    minlength: 5,
    maxlength: 255,
    required: true
  },
  genre: {
    type: genreSchema,
    required: true
  },
  numberInStock: {
    type: Number,
    min: 0,
    max: 255,
    required: true
  },
  dailyRentalRate: {
    type: Number,
    min: 0,
    max: 255,
    required: true
  }
});

const Book = mongoose.model("Book", bookSchema);

function validateBook(book) {
  const schema = {
    title: Joi.string()
      .min(5)
      .max(255)
      .required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number()
      .min(0)
      .max(255)
      .required(),
    dailyRentalRate: Joi.number()
      .min(0)
      .max(255)
      .required()
  };

  return Joi.validate(book, schema);
}

exports.Book = Book;
exports.validateBook = validateBook;
