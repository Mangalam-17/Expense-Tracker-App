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
            <td>{new Date(t.date).toLocaleDateString()}</td>
            <td>
              <button onClick={() => onDelete(t._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionList;
