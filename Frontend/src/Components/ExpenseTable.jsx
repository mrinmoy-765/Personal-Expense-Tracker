import React from "react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useAuth } from "../providers/AuthContext";

const categories = ["Food", "Transport", "Shopping", "Medical", "Others"];

const ExpenseTable = ({ expenses, queryClient }) => {
  const { user } = useAuth();
  const [editData, setEditData] = useState(null);

  //delete
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`http://localhost:5000/deleteExpense/${id}`);
    },
    onSuccess: () => {
      toast.success("Expense deleted");
      queryClient.invalidateQueries(["expenses"]);
    },
    onError: () => toast.error("Failed to delete expense"),
  });

  //update
  const onEdit = (expense) => {
    setEditData(expense);
    document.getElementById("expense_modal").showModal();
  };

  const updateMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.patch(
        `http://localhost:5000/updateExpense/${editData._id}`,
        {
          title: editData.title,
          amount: editData.amount,
          category: editData.category,
          date: editData.date,
        }
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Expense updated");
      queryClient.invalidateQueries(["expenses", user?._id]);
      document.getElementById("expense_modal").close();
    },
    onError: () => toast.error("Failed to update expense"),
  });

  return (
    <div className="overflow-x-auto px-32 pt-0 pb-16">
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
          {expenses.length > 0 ? (
            expenses.map((exp, index) => (
              <tr key={exp._id}>
                <td>{index + 1}</td>
                <td>{exp.title}</td>
                <td>{exp.amount}</td>
                <td>{exp.category}</td>
                <td>{exp.date}</td>
                <td className="space-x-7 text-lg">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => onEdit(exp)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteMutation.mutate(exp._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No expenses found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      <dialog id="expense_modal" className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-xl mb-4">Update Expense</h3>
          {editData && (
            <div className="space-y-3">
              <input
                type="text"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder="Title"
              />
              <input
                type="number"
                value={editData.amount}
                onChange={(e) =>
                  setEditData({ ...editData, amount: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder="Amount"
              />
              <select
                className="input input-bordered w-full"
                value={editData.category}
                onChange={(e) =>
                  setEditData({ ...editData, category: e.target.value })
                }
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={editData.date}
                onChange={(e) =>
                  setEditData({ ...editData, date: e.target.value })
                }
                className="input input-bordered w-full"
              />
            </div>
          )}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Cancel</button>
            </form>
            <button
              className="btn btn-primary"
              onClick={() => updateMutation.mutate()}
            >
              Save Changes
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ExpenseTable;
