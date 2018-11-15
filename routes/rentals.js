const Joi = require("joi");
const Fawn = require("fawn");
const { Rental, validateRental } = require("../models/rental");
const { Book } = require("../models/book");
const { Customer } = require("../models/customer");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

Fawn.init(mongoose);

// get rentals
router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("name");
  res.send(rentals);
});

// get rental by id
router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental)
    return res.status(404).send("The rental with the given ID was not found!");

  res.send(rental);
});

// create rental
router.post("/", async (req, res) => {
  const { error } = validateRental(req.body);
  console.log(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer");

  const book = await Book.findById(req.body.bookId);
  if (!book) return res.status(400).send("Invalid book");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    book: {
      _id: book._id,
      title: book.title,
      dailyRentalRate: book.dailyRentalRate
    }
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "books",
        { _id: book._id },
        {
          $inc: { numberInStock: -1 }
        }
      )
      .run();

    res.send(rental);
  } catch (ex) {
    res.status(500).send("somthing failed");
  }
});

module.exports = router;
