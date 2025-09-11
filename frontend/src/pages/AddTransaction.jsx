import { useNavigate } from "react-router-dom";
import TransactionForm from "../components/TransactionForm";
import { createTransaction } from "../api";

const AddTransaction = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    await createTransaction(data);
    navigate("/");
  };

  return (
    <div>
      <h1>Add Transaction</h1>
      <TransactionForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddTransaction;
