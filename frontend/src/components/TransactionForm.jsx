import { useEffect, useState, useRef } from "react";

const toDateInput = (value) => {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
};

const TransactionForm = ({ onSubmit, initialData = {} }) => {
  // Using a ref to track if first mount / initial data sync is done
  const didMountRef = useRef(false);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "income",
    category: "",
    description: "",
    date: "",
  });

  // Sync form only once on initialData change (usually on load)
  useEffect(() => {
    if (!didMountRef.current) {
      setForm({
        title: initialData.title || "",
        amount: initialData.amount ?? "",
        type: initialData.type || "income",
        category: initialData.category || "",
        description: initialData.description || "",
        date: toDateInput(initialData.date),
      });
      didMountRef.current = true;
    }
    // Only run when initialData changes; guards against overwriting input edits
  }, [initialData]);

  // Handle user input normally
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      date: form.date ? new Date(form.date).toISOString() : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        required
      />
      <input
        name="amount"
        type="number"
        value={form.amount}
        onChange={handleChange}
        placeholder="Amount"
        required
      />
      <select name="type" value={form.type} onChange={handleChange}>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <input
        name="category"
        value={form.category}
        onChange={handleChange}
        placeholder="Category"
        required
      />
      <input
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default TransactionForm;
