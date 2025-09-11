import { useState } from "react";

const TransactionForm = ({ onSubmit, initialData = {} }) => {
  const [form, setForm] = useState({
    title: initialData.title || "",
    amount: initialData.amount || "",
    type: initialData.type || "income",
    category: initialData.category || "",
    description: initialData.description || "",
    date: initialData.date || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
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
