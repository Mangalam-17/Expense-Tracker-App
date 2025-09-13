import React from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const TransactionCard = ({ txn, onEdit, onDelete }) => {
  return (
    <motion.div
      className={`flex justify-between items-center rounded-lg border p-5 shadow-sm hover:shadow-lg transition duration-300 bg-white
        ${
          txn.type === "income"
            ? "border-green-200 bg-green-50"
            : "border-red-200 bg-red-50"
        }
      `}
      whileHover={{ scale: 1.02 }}
      layout
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
          className="flex items-center gap-1 px-3 py-1 bg-white text-neutral-700 rounded-md border border-neutral-300 hover:bg-neutral-100 transition duration-200 ease-in-out"
          aria-label="Edit Transaction"
          type="button"
        >
          <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-md border border-red-700 hover:bg-red-700 transition duration-200 ease-in-out"
          aria-label="Delete Transaction"
          type="button"
        >
          <TrashIcon className="h-5 w-5" aria-hidden="true" />
          Delete
        </button>
      </div>
    </motion.div>
  );
};

export default TransactionCard;
