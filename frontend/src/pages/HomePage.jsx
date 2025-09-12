import { useEffect, useState } from "react";
import {
  getAllTransactions,
  deleteTransaction,
  deleteAllTransactions,
} from "../api";
import TransactionList from "../components/TransactionList";
import { useNavigate, useLocation } from "react-router-dom";

const ConfirmModal = ({ isOpen, title, message, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg p-6 w-11/12 max-w-sm z-10">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {message && <p className="text-sm text-gray-500 mt-2">{message}</p>}

        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              try {
                if (onConfirm) await onConfirm();
              } finally {
                onClose();
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => onClose(), 2500);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;

  const colors =
    toast.type === "success"
      ? "bg-green-600"
      : toast.type === "error"
        ? "bg-red-600"
        : "bg-blue-600";

  return (
    <div
      className={`fixed top-6 right-6 z-50 ${colors} text-white px-4 py-2 rounded-lg shadow-lg`}
    >
      {toast.message}
    </div>
  );
};

const HomePage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [toast, setToast] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

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

  const handleDelete = (id) => {
    setConfirmTitle("Delete Transaction");
    setConfirmMessage("Are you sure you want to delete this transaction?");
    setConfirmAction(() => async () => {
      try {
        await deleteTransaction(id);
        await fetchTransactions();
        setToast({
          message: "Transaction deleted successfully!",
          type: "success",
        });
      } catch (e) {
        setToast({
          message: e?.response?.data?.error || e.message,
          type: "error",
        });
      }
    });
    setConfirmOpen(true);
  };

  const handleDeleteAll = () => {
    setConfirmTitle("Delete All Transactions");
    setConfirmMessage("This will remove all your transactions. Are you sure?");
    setConfirmAction(() => async () => {
      try {
        await deleteAllTransactions();
        await fetchTransactions();
        setToast({
          message: "All transactions deleted successfully!",
          type: "success",
        });
      } catch (e) {
        setToast({
          message: e?.response?.data?.error || e.message,
          type: "error",
        });
      }
    });
    setConfirmOpen(true);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    const state = location.state || {};
    if (state.updated || state.successMessage) {
      const msg =
        state.successMessage ??
        (state.updated ? "Transaction updated successfully!" : null);
      if (msg) {
        setToast({ message: msg, type: "success" });
      }
      try {
        window.history.replaceState({}, document.title);
      } catch {}
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center p-6">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
          Expense Tracker App
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your expenses effortlessly with style ✨
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 max-w-4xl w-full">
        <h2 className="text-2xl font-bold mb-2 text-blue-700">
          All Transactions
        </h2>
        <p className="text-gray-500 mb-6">
          Track, update, and manage your expenses easily
        </p>

        <div className="flex flex-wrap gap-4 mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
          <button
            onClick={() => navigate("/add")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ➕ Add Transaction
          </button>
          <button
            onClick={handleDeleteAll}
            className="bg-red-100 text-red-700 px-5 py-2 rounded-lg hover:bg-red-200 border border-red-200 transition"
          >
            🗑️ Delete All
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
        ) : transactions.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p className="text-2xl mb-2">📭</p>
            <p>No transactions found. Start by adding one!</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <TransactionList
              transactions={transactions}
              onDelete={handleDelete}
            />
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        title={confirmTitle}
        message={confirmMessage}
        onClose={() => {
          setConfirmOpen(false);
          setConfirmAction(null);
        }}
        onConfirm={confirmAction}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default HomePage;
