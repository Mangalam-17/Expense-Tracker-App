import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import Navbar from "../components/Navbar";
import ConfirmModal from "../components/ConfirmModal";
import { toast } from "react-toastify";

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Confirmation modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteAll, setDeleteAll] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/transactions");
        setTransactions(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load transactions");
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Open modal for single transaction delete
  const askDeleteTransaction = (id) => {
    setDeleteId(id);
    setDeleteAll(false);
    setConfirmOpen(true);
  };

  // Open modal for delete all
  const askDeleteAll = () => {
    setDeleteAll(true);
    setConfirmOpen(true);
  };

  // Actual delete handlers with toast notifications
  const handleDeleteTransaction = async (id) => {
    try {
      await axios.delete(`/api/transactions/${id}`);
      setTransactions(transactions.filter((txn) => txn._id !== id));
      toast.success("Transaction deleted successfully");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete transaction");
    }
  };

  const handleDeleteAllTransactions = async () => {
    try {
      await axios.delete("/api/transactions");
      setTransactions([]);
      toast.success("All transactions deleted successfully");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete all transactions");
    }
  };

  // Confirm button handler on modal
  const handleConfirmDelete = async () => {
    if (deleteAll) {
      await handleDeleteAllTransactions();
    } else if (deleteId) {
      await handleDeleteTransaction(deleteId);
    }
    setConfirmOpen(false);
    setDeleteId(null);
    setDeleteAll(false);
  };

  const totalIncome = transactions
    .filter((txn) => txn.type === "income")
    .reduce((acc, txn) => acc + txn.amount, 0);

  const totalExpense = transactions
    .filter((txn) => txn.type === "expense")
    .reduce((acc, txn) => acc + txn.amount, 0);

  const balance = totalIncome - totalExpense;

  const filteredTransactions = transactions.filter((txn) => {
    if (filter !== "all" && txn.type !== filter) return false;

    if (
      searchTerm.trim() &&
      !(
        txn.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
      return false;

    return true;
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-14 px-3 sm:px-12 pb-8 bg-neutral-50 flex flex-col items-center font-sans">
        <div className="w-full max-w-3xl">
          <h1 className="text-4xl font-extrabold text-neutral-900 mb-8 mt-2 tracking-tight">
            Hello, <span className="font-semibold">{user?.name}</span>
          </h1>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-8">
            <button
              onClick={() => navigate("/add-transaction")}
              className="bg-neutral-900 hover:bg-neutral-700 text-white font-medium px-5 py-2 rounded-lg shadow-sm hover:shadow-md transition"
            >
              Add Transaction
            </button>
            <button
              onClick={askDeleteAll}
              className="bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 font-medium px-5 py-2 rounded-lg shadow-sm hover:shadow-md transition"
            >
              Delete All Transactions
            </button>
          </div>

          {/* Summary Cards */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="flex-1 bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-md p-6 text-neutral-900 font-semibold text-lg transition">
              <span className="block text-xs text-neutral-400 font-normal mb-1">
                Total Income
              </span>
              ₹{totalIncome}
            </div>
            <div className="flex-1 bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-md p-6 text-neutral-900 font-semibold text-lg transition">
              <span className="block text-xs text-neutral-400 font-normal mb-1">
                Total Expense
              </span>
              ₹{totalExpense}
            </div>
            <div className="flex-1 bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-md p-6 text-neutral-900 font-semibold text-lg transition">
              <span className="block text-xs text-neutral-400 font-normal mb-1">
                Balance
              </span>
              ₹{balance}
            </div>
          </div>

          {/* Filter/Search Inputs */}
          <div className="flex flex-col sm:flex-row gap-4 items-end mb-7">
            <div className="w-full sm:w-48">
              <label
                htmlFor="filter"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Filter Transactions:
              </label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md bg-white text-neutral-900 focus:ring-2 focus:ring-neutral-800 focus:border-neutral-900 transition"
              >
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="w-full flex-1">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Search:
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by Title or Category"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md bg-white text-neutral-900 focus:ring-2 focus:ring-neutral-800 focus:border-neutral-900 transition"
              />
            </div>
          </div>

          {loading && (
            <p className="text-neutral-500">Loading transactions...</p>
          )}
          {error && <p className="text-red-600 mb-4">{error}</p>}

          {!loading && !error && filteredTransactions.length === 0 && (
            <p className="text-neutral-400">No transactions found. Add some!</p>
          )}

          {!loading && !error && filteredTransactions.length > 0 && (
            <ul className="space-y-5 max-w-3xl">
              {filteredTransactions.map((txn) => (
                <li
                  key={txn._id}
                  className={`flex justify-between items-center rounded-lg border p-5 shadow-sm hover:shadow-md transition
                    ${
                      txn.type === "income"
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }
                  `}
                >
                  <div>
                    <h2 className="font-semibold text-neutral-900">
                      {txn.title}
                    </h2>
                    <p className="text-sm text-neutral-500">
                      {new Date(txn.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs italic text-neutral-400">
                      {txn.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-extrabold text-lg ${
                        txn.type === "income"
                          ? "text-green-700"
                          : "text-red-600"
                      }`}
                    >
                      ₹{txn.amount}
                    </span>
                    <button
                      onClick={() =>
                        navigate(`/edit-transaction/${txn._id}`, {
                          state: {
                            onSuccessMessage:
                              "Transaction updated successfully",
                          },
                        })
                      }
                      className="px-4 py-1 bg-white text-neutral-700 rounded-md border border-neutral-300 hover:bg-neutral-100 transition"
                      aria-label="Edit Transaction"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => askDeleteTransaction(txn._id)}
                      className="px-4 py-1 bg-red-600 text-white rounded-md border border-red-700 hover:bg-red-700 transition"
                      aria-label="Delete Transaction"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title={deleteAll ? "Delete All Transactions" : "Delete Transaction"}
        message={
          deleteAll
            ? "Are you sure you want to delete ALL transactions? This action cannot be undone."
            : "Are you sure you want to delete this transaction?"
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setDeleteId(null);
          setDeleteAll(false);
        }}
      />
    </>
  );
};

export default HomePage;
