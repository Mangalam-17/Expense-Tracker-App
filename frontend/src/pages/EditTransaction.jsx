import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TransactionForm from "../components/TransactionForm";
import { getTransaction, updateTransaction } from "../api";
import { Edit3, ArrowLeft, Loader2 } from "lucide-react";

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
      navigate("/", { state: { updated: true } });
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading transaction...</p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Error Loading Transaction
          </h2>
          <p className="text-gray-600 mb-4">{err}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mt-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
            title="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg mr-3">
              <Edit3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Edit Transaction
              </h1>
              <p className="text-sm text-gray-500">
                Update your transaction details
              </p>
            </div>
          </div>
        </div>

        {transaction && (
          <TransactionForm onSubmit={handleSubmit} initialData={transaction} />
        )}
      </div>
    </div>
  );
};

export default EditTransaction;
