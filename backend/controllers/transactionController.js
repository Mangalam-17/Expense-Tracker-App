const Transaction = require("../models/Trasaction");

// Create: POST /api/transactions
const createTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read all: GET /api/transactions
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({
      date: -1,
      createdAt: -1,
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read one: GET /api/transactions/:id
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!transaction)
      return res.status(404).json({ error: "Transaction not found" });
    res.json(transaction);
  } catch (err) {
    if (err.name === "CastError")
      return res.status(400).json({ error: "Invalid id" });
    res.status(500).json({ error: err.message });
  }
};

// Update: PUT /api/transactions/:id
const updateTransaction = async (req, res) => {
  try {
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
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
};

// Delete many: DELETE /api/transactions
const deleteAllTransactions = async (req, res) => {
  try {
    const result = await Transaction.deleteMany({ user: req.user._id });
    res.json({
      message: `${result.deletedCount} transactions deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete one: DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!deleted)
      return res.status(404).json({ error: "Transaction not found" });
    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    if (err.name === "CastError")
      return res.status(400).json({ error: "Invalid id" });
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteAllTransactions,
  deleteTransaction,
};
