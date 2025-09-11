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
    if (!confirm("Delete this transaction?")) return;
    try {
      await deleteTransaction(id);
      fetchTransactions();
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Delete ALL transactions?")) return;
    try {
      await deleteAllTransactions();
      fetchTransactions();
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    }
  };

  useEffect(() => {
    let ignore = false;
    (async () => {
      await fetchTransactions();
    })();
    return () => {
      ignore = true; // pattern placeholder if adding subscriptions later
    };
  }, []);

  if (loading) return <p>Loading...</p>;
  if (err)
    return (
      <div>
        <p style={{ color: "red" }}>Error: {err}</p>
        <button onClick={fetchTransactions}>Retry</button>
      </div>
    );

  return (
    <div>
      <h1>All Transactions</h1>
      <button onClick={() => navigate("/add")}>Add Transaction</button>
      <button onClick={handleDeleteAll}>Delete All</button>
      <TransactionList transactions={transactions} onDelete={handleDelete} />
    </div>
  );
};

export default HomePage;
