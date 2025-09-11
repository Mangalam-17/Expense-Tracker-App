import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TransactionForm from "../components/TransactionForm";
import { getTransaction, updateTransaction } from "../api";

const EditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await getTransaction(id);
        if (!ignore) setTransaction(res.data);
      } catch (e) {
        if (!ignore) setErr(e?.response?.data?.error || e.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      await updateTransaction(id, data);
      navigate("/");
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (err) return <p style={{ color: "red" }}>Error: {err}</p>;

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
