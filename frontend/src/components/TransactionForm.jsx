import { useEffect, useState } from "react";

const toDateInput = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10); // YYYY-MM-DD for date input
};

const TransactionForm = ({ onSubmit, initialData = {} }) => {
  const [form, setForm] = useState({
    title: initialData.title || "",
    amount: initialData.amount ?? "",
    type: initialData.type || "income",
    category: initialData.category || "",
    description: initialData.description || "",
    date: toDateInput(initialData.date),
  });

  // Sync form when initialData changes (e.g., after fetching on edit page)
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      title: initialData.title || "",
      amount: initialData.amount ?? "",
      type: initialData.type || "income",
      category: initialData.category || "",
      description: initialData.description || "",
      date: toDateInput(initialData.date),
    }));
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      // Normalize date to ISO string; server (Mongoose) will cast it to Date
      date: form.date ? new Date(form.date).toISOString() : undefined,
    };
    onSubmit(payload);
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
