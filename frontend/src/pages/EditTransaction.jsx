import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import TransactionForm from "../components/TransactionForm";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const EditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const { data } = await axios.get(`/api/transactions/${id}`);
        setTransaction(data);
        setLoading(false);
      } catch (err) {
        alert("Failed to fetch transaction");
        navigate("/");
      }
    };
    fetchTransaction();
  }, [id, navigate]);

  const handleUpdateTransaction = async (formData) => {
    setFormLoading(true);
    try {
      await axios.put(`/api/transactions/${id}`, formData);
      setFormLoading(false);
      toast.success("Transaction updated successfully");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update transaction");
      setFormLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-14 flex items-center justify-center bg-neutral-50 font-sans">
        <motion.div
          className="text-neutral-500 text-lg font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Loading transaction...
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-14 flex items-center justify-center bg-neutral-50 font-sans">
        <motion.div
          className="w-full max-w-md"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 mb-6">
              Edit Transaction
            </h1>
            <TransactionForm
              initialData={transaction}
              onSubmit={handleUpdateTransaction}
              loading={formLoading}
            />
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default EditTransaction;
