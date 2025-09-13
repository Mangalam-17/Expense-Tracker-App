import React from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const TransactionCard = ({ txn, onEdit, onDelete }) => {
  return (
    <li
      className={`flex justify-between items-center rounded-lg border p-5 shadow-sm hover:shadow-md transition
        ${
          txn.type === "income"
            ? "bg-green-50 border-green-200"
            : "bg-red-50 border-red-200"
        }`}
    >
      <div>
        <h2 className="font-semibold text-neutral-900">{txn.title}</h2>
        <p className="text-sm text-neutral-500">
          {new Date(txn.date).toLocaleDateString()}
        </p>
        <p className="text-xs italic text-neutral-400">{txn.category}</p>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`font-extrabold text-lg ${
            txn.type === "income" ? "text-green-700" : "text-red-600"
          }`}
        >
          ₹{txn.amount}
        </span>
        <button
          onClick={onEdit}
          className="flex items-center gap-1 px-3 py-1 bg-white text-neutral-700 rounded-md border border-neutral-300 hover:bg-neutral-100 transition"
          aria-label="Edit Transaction"
        >
          <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-md border border-red-700 hover:bg-red-700 transition"
          aria-label="Delete Transaction"
        >
          <TrashIcon className="h-5 w-5" aria-hidden="true" />
          Delete
        </button>
      </div>
    </li>
  );
};

export default TransactionCard;
