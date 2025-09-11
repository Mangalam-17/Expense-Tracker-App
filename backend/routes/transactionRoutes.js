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

// Read Operation, reading all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read Operation, reading a single transaction via id
router.get("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction)
      return res.status(404).json({ error: "Transaction not found" });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Operation, update a transaction via id
router.put("/:id", async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTransaction)
      return res.status(404).json({ error: "Transaction not found" });
    res.json(updatedTransaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Operation, delete all transactions
router.delete("/", async (req, res) => {
  try {
    const result = await Transaction.deleteMany({});
    res.json({
      message: `${result.deletedCount} transactions deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Operation, delete a transaction via id
router.delete("/:id", async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(
      req.params.id
    );
    if (!deletedTransaction)
      return res.status(404).json({ error: "Transaction not found" });
    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
