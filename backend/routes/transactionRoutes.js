const express = require("express");
const {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  deleteAllTransactions,
} = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply protect middleware to all transaction routes
router.get("/", protect, getAllTransactions);
router.get("/:id", protect, getTransactionById);
router.post("/", protect, createTransaction);
router.put("/:id", protect, updateTransaction);
router.delete("/:id", protect, deleteTransaction);
router.delete("/", protect, deleteAllTransactions);

module.exports = router;
