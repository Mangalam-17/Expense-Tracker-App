import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import TransactionForm from "../components/TransactionForm";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

const AddTransactionPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAddTransaction = async (data) => {
    setLoading(true);
    try {
      await axios.post("/api/transactions", data);
      setLoading(false);
      toast.success("Transaction added successfully");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add transaction");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-14 flex items-center justify-center bg-neutral-50 font-sans">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 mb-6">
              Add Transaction
            </h1>
            <TransactionForm
              onSubmit={handleAddTransaction}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTransactionPage;
