import { useState, useEffect } from "react";

const TransactionForm = ({ onSubmit, initialData = {}, loading }) => {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
    date: "",
    description: "",
  });

  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (initialData && initialData._id) {
      let dateValue = "";
      if (initialData.date) {
        dateValue = initialData.date.split("T")[0];
      }
      setForm({
        title: initialData.title || "",
        amount: initialData.amount || "",
        type: initialData.type || "expense",
        category: initialData.category || "",
        date: dateValue,
        description: initialData.description || "",
      });
    } else {
      setForm({
        title: "",
        amount: "",
        type: "expense",
        category: "",
        date: "",
        description: "",
      });
    }
  }, [initialData?._id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (
      !form.title ||
      !form.amount ||
      !form.type ||
      !form.category ||
      !form.date
    ) {
      setFormError("All fields except description are required.");
      return;
    }

    onSubmit({ ...form, amount: Number(form.amount) });
  };

  return (
    <div className="mb-6 p-6 bg-white shadow-lg rounded-xl max-w-xl">
      <h2 className="text-xl font-semibold mb-5 text-neutral-900">
        {initialData && initialData._id
          ? "Edit Transaction"
          : "Add Transaction"}
      </h2>
      {formError && (
        <div className="mb-2 text-red-600 bg-red-100 border border-red-300 p-2 rounded">
          {formError}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-4 items-center"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="flex-1 min-w-[120px] px-3 py-2 border border-neutral-300 rounded-md bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
          min="1"
          className="w-28 px-3 py-2 border border-neutral-300 rounded-md bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          required
          className="w-32 px-3 py-2 border border-neutral-300 rounded-md bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-32 px-3 py-2 border border-neutral-300 rounded-md bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="w-40 px-3 py-2 border border-neutral-300 rounded-md bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
        />
        <input
          type="text"
          name="description"
          placeholder="Description (optional)"
          value={form.description}
          onChange={handleChange}
          className="flex-1 min-w-[120px] px-3 py-2 border border-neutral-300 rounded-md bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 rounded-lg font-semibold text-white shadow-md transition duration-300 ease-in-out ${
            loading
              ? "bg-neutral-400 cursor-not-allowed shadow-sm"
              : "bg-neutral-900 hover:bg-neutral-800 shadow-lg"
          }`}
        >
          {loading
            ? initialData && initialData._id
              ? "Updating..."
              : "Adding..."
            : initialData && initialData._id
              ? "Update"
              : "Add"}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
