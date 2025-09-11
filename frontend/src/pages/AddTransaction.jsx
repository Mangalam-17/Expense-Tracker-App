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
    <div>
      <h1>Add Transaction</h1>
      <TransactionForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddTransaction;
