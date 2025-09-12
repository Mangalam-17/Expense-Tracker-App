import { Link } from "react-router-dom";

const TransactionList = ({ transactions, onDelete }) => (
  <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
    <thead>
      <tr className="bg-gray-100">
        <th className="px-4 py-3 text-left font-semibold">Title</th>
        <th className="px-4 py-3 text-left font-semibold">Amount</th>
        <th className="px-4 py-3 text-left font-semibold">Type</th>
        <th className="px-4 py-3 text-left font-semibold">Category</th>
        <th className="px-4 py-3 text-left font-semibold">Description</th>
        <th className="px-4 py-3 text-left font-semibold">Date</th>
        <th className="px-4 py-3 text-left font-semibold">Actions</th>
      </tr>
    </thead>
    <tbody>
      {transactions.map((t, idx) => (
        <tr key={t._id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
          <td className="px-4 py-2">{t.title}</td>
          <td className="px-4 py-2 font-mono">
            <span
              className={
                t.type === "expense" ? "text-red-600" : "text-green-600"
              }
            >
              ₹
              {Number(t.amount).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </span>
          </td>
          <td className="px-4 py-2">
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-bold
                ${
                  t.type === "income"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
            >
              {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
            </span>
          </td>
          <td className="px-4 py-2">{t.category}</td>
          <td className="px-4 py-2">{t.description}</td>
          <td className="px-4 py-2 whitespace-nowrap">
            {t.date ? new Date(t.date).toLocaleDateString() : "-"}
          </td>
          <td className="px-4 py-2 flex gap-2">
  <Link
    to={`/${t._id}/edit`}
    className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
  >
    Edit
  </Link>
  <button
    onClick={() => onDelete(t._id)}
    className="px-3 py-1 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200 hover:text-red-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
  >
    Delete
  </button>
</td>

        </tr>
      ))}
    </tbody>
  </table>
);

export default TransactionList;
