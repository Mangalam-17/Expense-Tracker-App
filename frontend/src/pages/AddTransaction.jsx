import { useNavigate } from "react-router-dom";
import TransactionForm from "../components/TransactionForm";
import { createTransaction } from "../api";

const AddTransaction = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      await createTransaction(data);
      navigate("/");
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mt-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">
          Add Transaction
        </h1>
        <TransactionForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default AddTransaction;
