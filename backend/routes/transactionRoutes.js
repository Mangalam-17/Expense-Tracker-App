const express = require("express");
const router = express.Router();
const Transaction = require("../models/Trasaction");

// Create: POST /api/transactions
router.post("/", async (req, res) => {
  try {
    const createTransaction = await Transaction.create(req.body);
    res.status(201).json(createTransaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all: GET /api/transactions
router.get("/", async (_req, res) => {
  try {
    const transactions = await Transaction.find().sort({
      date: -1,
      createdAt: -1,
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one: GET /api/transactions/:id
router.get("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction)
      return res.status(404).json({ error: "Transaction not found" });
    res.json(transaction);
  } catch (err) {
    if (err.name === "CastError")
      return res.status(400).json({ error: "Invalid id" });
    res.status(500).json({ error: err.message });
  }
});

// Update: PUT /api/transactions/:id
router.put("/:id", async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated)
      return res.status(404).json({ error: "Transaction not found" });
    res.json(updated);
  } catch (err) {
    if (err.name === "CastError")
      return res.status(400).json({ error: "Invalid id" });
    if (err.name === "ValidationError")
      return res.status(400).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// Delete many: DELETE /api/transactions
router.delete("/", async (_req, res) => {
  try {
    const result = await Transaction.deleteMany({});
    res.json({
      message: `${result.deletedCount} transactions deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete one: DELETE /api/transactions/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Transaction not found" });
    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    if (err.name === "CastError")
      return res.status(400).json({ error: "Invalid id" });
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
