import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import TransactionForm from "../components/TransactionForm";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

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

  if (loading) {
    return (
      <div className="min-h-screen pt-14 flex items-center justify-center bg-neutral-50 font-sans">
        <div className="text-neutral-500 text-lg font-medium">
          Loading transaction...
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-14 flex items-center justify-center bg-neutral-50 font-sans">
        <div className="w-full max-w-md">
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
        </div>
      </div>
    </>
  );
};

export default EditTransaction;
