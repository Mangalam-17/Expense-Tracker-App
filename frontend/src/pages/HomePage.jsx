import { useEffect, useState } from "react";
import {
  getAllTransactions,
  deleteTransaction,
  deleteAllTransactions,
} from "../api";
import TransactionList from "../components/TransactionList";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setErr(null);
      const res = await getAllTransactions();
      setTransactions(res.data);
    } catch (e) {
      setErr(e?.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await deleteTransaction(id);
      fetchTransactions();
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Delete ALL transactions?")) return;
    try {
      await deleteAllTransactions();
      fetchTransactions();
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">
          All Transactions
        </h1>
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => navigate("/add")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add Transaction
          </button>
          <button
            onClick={handleDeleteAll}
            className="bg-red-100 text-red-700 px-5 py-2 rounded-lg hover:bg-red-200 border border-red-200 transition"
          >
            Delete All
          </button>
        </div>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : err ? (
          <div className="text-red-600 mb-4">
            <p>Error: {err}</p>
            <button
              className="mt-2 bg-gray-200 text-gray-600 px-3 py-1 rounded"
              onClick={fetchTransactions}
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <TransactionList
              transactions={transactions}
              onDelete={handleDelete}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
