import { Link } from "react-router-dom";

const TransactionList = ({ transactions, onDelete }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Amount</th>
          <th>Type</th>
          <th>Category</th>
          <th>Description</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t) => (
          <tr key={t._id}>
            <td>{t.title}</td>
            <td>{t.amount}</td>
            <td>{t.type}</td>
            <td>{t.category}</td>
            <td>{t.description}</td>
            <td>{t.date ? new Date(t.date).toLocaleDateString() : "-"}</td>
            <td>
              <Link to={`/${t._id}/edit`}>Edit</Link>{" "}
              <button onClick={() => onDelete(t._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionList;
