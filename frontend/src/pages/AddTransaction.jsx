import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import TransactionForm from "../components/TransactionForm";
import Navbar from "../components/Navbar";

const AddTransactionPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAddTransaction = async (data) => {
    setLoading(true);
    try {
      await axios.post("/api/transactions", data);
      setLoading(false);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add transaction");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-6 bg-gray-50 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">
          Add Transaction
        </h1>
        <TransactionForm onSubmit={handleAddTransaction} loading={loading} />
      </div>
    </>
  );
};

export default AddTransactionPage;
