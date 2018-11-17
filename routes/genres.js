const { Genre, validateGenre } = require("../models/genre");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");

// get all genres  get
router.get("/", async (req, res) => {
  const genres = await Genre.find()
    .select("-__v")
    .sort("name");
  res.send(genres);
});

// get genre by id get
router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send("Genre with given ID not found!");

  res.send(genre);
});

// create genre // post
router.post("/", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  res.send(genre);
});

// update genre by id put
router.put("/:id", [auth, validateObjectId], async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: { name: req.body.name }
    },
    { new: true }
  );

  if (!genre) return res.status(404).send("Genre with given ID not found!");

  res.send(genre);
});

// delete genre by id delete
router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) return res.status(404).send("Genre with given ID was not found!");

  res.send(genre);
});

module.exports = router;
