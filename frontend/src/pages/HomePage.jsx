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
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    const res = await getAllTransactions();
    setTransactions(res.data);
  };

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    fetchTransactions();
  };

  const handleDeleteAll = async () => {
    await deleteAllTransactions();
    fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

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
