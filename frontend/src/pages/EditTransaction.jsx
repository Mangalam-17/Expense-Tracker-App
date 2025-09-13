import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import TransactionForm from "../components/TransactionForm";
import Navbar from "../components/Navbar";

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
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update transaction");
      setFormLoading(false);
    }
  };

  if (loading) return <p>Loading transaction...</p>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-6 bg-gray-50 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">
          Edit Transaction
        </h1>
        <TransactionForm
          initialData={transaction}
          onSubmit={handleUpdateTransaction}
          loading={formLoading}
        />
      </div>
    </>
  );
};

export default EditTransaction;
