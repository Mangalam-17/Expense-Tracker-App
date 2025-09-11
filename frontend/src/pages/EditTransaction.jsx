import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TransactionForm from "../components/TransactionForm";
import { getTransaction, updateTransaction } from "../api";

const EditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      const res = await getTransaction(id);
      setTransaction(res.data);
    };
    fetchTransaction();
  }, [id]);

  const handleSubmit = async (data) => {
    await updateTransaction(id, data);
    navigate("/");
  };

  return (
    <div>
      <h1>Edit Transaction</h1>
      {transaction && (
        <TransactionForm onSubmit={handleSubmit} initialData={transaction} />
      )}
    </div>
  );
};

export default EditTransaction;
