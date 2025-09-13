import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await axios.delete(`/api/transactions/${id}`);
        setTransactions(transactions.filter((txn) => txn._id !== id));
      } catch (err) {
        alert(err.response?.data?.error || "Failed to delete transaction");
      }
    }
  };

  const handleDeleteAllTransactions = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete ALL transactions? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete("/api/transactions"); // Backend must support this route
        setTransactions([]);
      } catch (err) {
        alert(err.response?.data?.error || "Failed to delete all transactions");
      }
    }
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
      <div className="min-h-screen p-6 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">
          Hello, {user?.name}
        </h1>

        <div className="flex items-center mb-6 gap-4 max-w-xl">
          <button
            onClick={() => navigate("/add-transaction")}
            className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
          >
            Add Transaction
          </button>
          <button
            onClick={handleDeleteAllTransactions}
            className="ml-auto px-4 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700"
          >
            Delete All Transactions
          </button>
        </div>

        <div className="mb-6 max-w-xl space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 p-4 bg-green-200 rounded shadow text-green-900 font-semibold">
              Total Income: ₹{totalIncome}
            </div>
            <div className="flex-1 p-4 bg-red-200 rounded shadow text-red-900 font-semibold">
              Total Expense: ₹{totalExpense}
            </div>
            <div className="flex-1 p-4 bg-blue-200 rounded shadow text-blue-900 font-semibold">
              Balance: ₹{balance}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-48">
              <label htmlFor="filter" className="block mb-1 font-semibold">
                Filter Transactions:
              </label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="flex-1">
              <label htmlFor="search" className="block mb-1 font-semibold">
                Search:
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by Title or Category"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
        </div>

        {loading && <p>Loading transactions...</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {!loading && !error && filteredTransactions.length === 0 && (
          <p>No transactions found. Add some!</p>
        )}

        {!loading && !error && filteredTransactions.length > 0 && (
          <ul className="space-y-4 max-w-xl">
            {filteredTransactions.map((txn) => (
              <li
                key={txn._id}
                className={`p-4 rounded shadow flex justify-between items-center ${
                  txn.type === "income" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <div>
                  <h2 className="font-semibold">{txn.title}</h2>
                  <p className="text-sm text-gray-600">
                    {new Date(txn.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm italic">{txn.category}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`font-bold text-lg ${
                      txn.type === "income" ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    ₹{txn.amount}
                  </span>
                  <button
                    onClick={() => navigate(`/edit-transaction/${txn._id}`)}
                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteTransaction(txn._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default HomePage;
