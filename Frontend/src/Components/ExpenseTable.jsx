import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ExpenseTable = ({ expenses, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp, idx) => (
            <tr key={exp._id}>
              <td>{idx + 1}</td>
              <td>{exp.title}</td>
              <td>{exp.amount}</td>
              <td>{exp.category}</td>
              <td>{exp.date}</td>
              <td className="space-x-6 text-lg">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => onEdit(exp)}
                >
                  <FaEdit />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => onDelete(exp._id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
          {expenses.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No expenses found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;
