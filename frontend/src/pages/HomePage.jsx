import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import Navbar from "../components/Navbar";
import ConfirmModal from "../components/ConfirmModal";
import TransactionCard from "../components/TransactionCard";

import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import Confetti from "react-confetti";
import { toast } from "react-toastify";

// Error boundary to catch render errors and show messages instead of blank page
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, errorInfo: error.toString() };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: "red" }}>
          <h2>Something went wrong rendering this page.</h2>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.errorInfo}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Confirmation modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteAll, setDeleteAll] = useState(false);

  // Confetti state
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        console.log("Fetching transactions...");
        setLoading(true);
        const { data } = await axios.get("/api/transactions");
        console.log("Transactions data fetched:", data);
        setTransactions(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load transactions");
        setLoading(false);
        console.error("Error fetching transactions:", err);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    console.log("Current user in HomePage:", user);
  }, [user]);

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const askDeleteTransaction = (id) => {
    setDeleteId(id);
    setDeleteAll(false);
    setConfirmOpen(true);
  };

  const askDeleteAll = () => {
    setDeleteAll(true);
    setConfirmOpen(true);
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await axios.delete(`/api/transactions/${id}`);
      setTransactions(transactions.filter((txn) => txn._id !== id));
      toast.success("Transaction deleted successfully");
      triggerConfetti();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete transaction");
    }
  };

  const handleDeleteAllTransactions = async () => {
    try {
      await axios.delete("/api/transactions");
      setTransactions([]);
      toast.success("All transactions deleted successfully");
      triggerConfetti();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete all transactions");
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteAll) {
      await handleDeleteAllTransactions();
    } else if (deleteId) {
      await handleDeleteTransaction(deleteId);
    }
    setConfirmOpen(false);
    setDeleteId(null);
    setDeleteAll(false);
  };

  const totalIncome = transactions
    .filter((txn) => txn.type === "income")
    .reduce((acc, txn) => acc + txn.amount, 0);

  const totalExpense = transactions
    .filter((txn) => txn.type === "expense")
    .reduce((acc, txn) => acc + txn.amount, 0);

  const balance = totalIncome - totalExpense;

  const filteredTransactions = transactions.filter((txn) => {
    if (filter !== "all" && txn.type !== filter) return false;

    if (
      searchTerm.trim() &&
      !(
        txn.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
      return false;

    return true;
  });

  const SkeletonCard = () => (
    <div className="animate-pulse flex justify-between items-center rounded-lg border p-5 shadow-sm bg-white max-w-3xl my-2">
      <div>
        <div className="h-5 w-48 bg-gray-300 rounded mb-2"></div>
        <div className="h-3 w-28 bg-gray-200 rounded mb-1"></div>
        <div className="h-3 w-20 bg-gray-200 rounded"></div>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-6 w-12 bg-gray-300 rounded"></div>
        <div className="h-8 w-16 bg-gray-300 rounded"></div>
        <div className="h-8 w-16 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1 },
    }),
  };

  return (
    <ErrorBoundary>
      <>
        <Navbar />

        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fullScreen: { enable: false },
            background: { color: "#F9FAFB" },
            fpsLimit: 60,
            interactivity: {
              detectsOn: "canvas",
              events: {
                onHover: { enable: true, mode: "repulse" },
                resize: true,
              },
              modes: {
                repulse: { distance: 100, duration: 0.4 },
              },
            },
            particles: {
              color: { value: "#9CA3AF" },
              links: {
                color: "#D1D5DB",
                distance: 150,
                enable: true,
                opacity: 0.3,
                width: 1,
              },
              collisions: { enable: false },
              move: {
                directions: "none",
                enable: true,
                outModes: "bounce",
                random: false,
                speed: 1.5,
                straight: false,
              },
              number: { density: { enable: true, area: 800 }, value: 40 },
              opacity: { value: 0.4, random: false },
              shape: { type: "circle" },
              size: { value: { min: 1, max: 3 }, random: true },
            },
            detectRetina: true,
          }}
          style={{
            position: "absolute",
            top: 56,
            left: 0,
            width: "100%",
            height: "calc(100% - 56px)",
            zIndex: 0,
          }}
        />

        <div className="relative z-10 min-h-screen pt-14 px-3 sm:px-12 pb-8 flex flex-col items-center font-sans">
          <div className="w-full max-w-3xl">
            <motion.h1
              className="text-4xl font-extrabold text-neutral-900 mb-8 mt-2 tracking-tight flex items-center gap-2"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
            >
              <span role="img" aria-label="wave">
                👋
              </span>
              Hello, <span className="font-semibold">{user?.name}</span>
            </motion.h1>

            <motion.div
              className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-8"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
            >
              <button
                onClick={() => navigate("/add-transaction")}
                className="bg-neutral-900 hover:bg-neutral-700 text-white font-medium px-5 py-2 rounded-lg shadow-sm hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
              >
                <span role="img" aria-label="add">
                  ➕
                </span>{" "}
                Add Transaction
              </button>
              <button
                onClick={askDeleteAll}
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2 rounded-lg shadow-sm hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
              >
                <span role="img" aria-label="delete-all">
                  🗑️
                </span>{" "}
                Delete All Transactions
              </button>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-10"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
            >
              <div className="flex-1 bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-lg transition-transform duration-300 ease-in-out transform hover:-translate-y-0.5 p-6 text-neutral-900 font-semibold text-lg flex flex-col items-start">
                <span className="block text-xs text-neutral-400 font-normal mb-1">
                  <span role="img" aria-label="income">
                    💰
                  </span>{" "}
                  Total Income
                </span>
                <CountUp
                  start={0}
                  end={totalIncome}
                  duration={1.5}
                  separator=","
                  prefix="₹"
                />
              </div>
              <div className="flex-1 bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-lg transition-transform duration-300 ease-in-out transform hover:-translate-y-0.5 p-6 text-neutral-900 font-semibold text-lg flex flex-col items-start">
                <span className="block text-xs text-neutral-400 font-normal mb-1">
                  <span role="img" aria-label="expense">
                    🛒
                  </span>{" "}
                  Total Expense
                </span>
                <CountUp
                  start={0}
                  end={totalExpense}
                  duration={1.5}
                  separator=","
                  prefix="₹"
                />
              </div>
              <div className="flex-1 bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-lg transition-transform duration-300 ease-in-out transform hover:-translate-y-0.5 p-6 text-neutral-900 font-semibold text-lg flex flex-col items-start">
                <span className="block text-xs text-neutral-400 font-normal mb-1">
                  <span role="img" aria-label="balance">
                    ⚖️
                  </span>{" "}
                  Balance
                </span>
                <CountUp
                  start={0}
                  end={balance}
                  duration={1.5}
                  separator=","
                  prefix="₹"
                />
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 items-end mb-7"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={3}
            >
              <div className="w-full sm:w-48">
                <label
                  htmlFor="filter"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  <span role="img" aria-label="filter">
                    🔎
                  </span>{" "}
                  Filter Transactions:
                </label>
                <select
                  id="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md bg-white text-neutral-900 focus:ring-2 focus:ring-neutral-800 focus:border-neutral-900 transition cursor-pointer"
                >
                  <option value="all">All</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div className="w-full flex-1">
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  <span role="img" aria-label="search">
                    🔍
                  </span>{" "}
                  Search:
                </label>
                <input
                  type="text"
                  id="search"
                  placeholder="Search by Title or Category"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md bg-white text-neutral-900 focus:ring-2 focus:ring-neutral-800 focus:border-neutral-900 transition"
                />
              </div>
            </motion.div>

            {loading && (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            )}

            {error && <p className="text-red-600 mb-4">{error}</p>}

            {!loading && !error && filteredTransactions.length === 0 && (
              <p className="text-neutral-400">
                No transactions found. Add some! 📝
              </p>
            )}

            {!loading && !error && filteredTransactions.length > 0 && (
              <ul className="space-y-5 max-w-3xl">
                <AnimatePresence>
                  {filteredTransactions.map((txn) => (
                    <motion.div
                      key={txn._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TransactionCard
                        txn={txn}
                        onEdit={() =>
                          navigate(`/edit-transaction/${txn._id}`, {
                            state: {
                              onSuccessMessage:
                                "Transaction updated successfully",
                            },
                          })
                        }
                        onDelete={() => askDeleteTransaction(txn._id)}
                        editButtonClass="bg-yellow-400 hover:bg-yellow-300 text-black font-medium px-4 py-1 rounded-lg shadow hover:shadow-md transition cursor-pointer flex items-center gap-1"
                        editButtonEmoji="✏️"
                        deleteButtonClass="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-1 rounded-lg shadow hover:shadow-md transition cursor-pointer flex items-center gap-1"
                        deleteButtonEmoji="🗑️"
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </div>

        <ConfirmModal
          open={confirmOpen}
          title={deleteAll ? "Delete All Transactions" : "Delete Transaction"}
          message={
            deleteAll
              ? "Are you sure you want to delete ALL transactions? This action cannot be undone."
              : "Are you sure you want to delete this transaction?"
          }
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setConfirmOpen(false);
            setDeleteId(null);
            setDeleteAll(false);
          }}
        />

        {showConfetti && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={150}
          />
        )}
      </>
    </ErrorBoundary>
  );
};

export default HomePage;
