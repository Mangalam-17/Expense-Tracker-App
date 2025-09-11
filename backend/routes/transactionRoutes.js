const express = require("express");
const router = express.Router();
const Transaction = require("../models/Trasaction");

// CRUD Operation
// Create Operation, creating a transaction
router.post("/", async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;