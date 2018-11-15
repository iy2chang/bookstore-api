const express = require("express");
const router = express.Router();
const { Customer, validateCustomer } = require("../models/customer");

// get all customers
router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

// get customer by id
router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res.status(404).send("The customer with given ID was not found!");

  res.send(customer);
});

// create a customer
router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGole: req.body.isGold
  });

  await customer.save();

  res.send(customer);
});

// update a customer by id
router.put("/:id", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
      }
    },
    { new: true }
  );

  if (!customer)
    return res.status(404).send("The customer with given ID was not found!");

  res.send(customer);
});

// deleate a customer by id
router.delete("/:id", async (req, res) => {
  const customer = await Customer.findOneAndRemove({ _id: req.params.id });
  if (!customer)
    return res.status(404).send("The customer with given ID was not found!");

  res.send(customer);
});

module.exports = router;
