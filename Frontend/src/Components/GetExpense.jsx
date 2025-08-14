import React, { useState } from "react";
import { useAuth } from "../providers/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const categories = ["Food", "Transport", "Shopping", "Medical", "Others"];

const GetExpense = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editData, setEditData] = useState(null);

  // Fetch
  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ["expenses", user?._id],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:5000/getExpenses/${user._id}`
      );
      return data;
    },
    enabled: !!user?._id,
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: async (expenseId) => {
      await axios.delete(`http://localhost:5000/deleteExpense/${expenseId}`);
    },
    onSuccess: () => {
      toast.success("Expense deleted");
      queryClient.invalidateQueries(["expenses", user?._id]);
    },
    onError: () => toast.error("Failed to delete expense"),
  });

  // Update
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

  // Open edit modal
  const editExpense = (expense) => {
    setEditData({ ...expense });
    document.getElementById("expense_modal").showModal();
  };

  if (isLoading) {
    return <div className="py-16 px-32">Loading expenses...</div>;
  }

  return (
    <div className="py-16 px-32">
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
          <tbody className="items-center">
            {expenses.length > 0 ? (
              expenses.map((expense, index) => (
                <tr key={expense._id}>
                  <th>{index + 1}</th>
                  <td>{expense.title}</td>
                  <td>{expense.amount}</td>
                  <td>
                    <div className="badge badge-soft badge-primary">
                      {expense.category}
                    </div>
                  </td>
                  <td>{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="flex gap-6">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => editExpense(expense)}
                    >
                      <FaEdit className="text-xl" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => deleteMutation.mutate(expense._id)}
                    >
                      <FaTrash className="text-xl" />
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
      </div>

      {/* Edit Modal */}
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
                <option value="">{editData.category}</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={editData.date?.split("T")[0]}
                onChange={(e) =>
                  setEditData({ ...editData, date: e.target.value })
                }
                className="input input-bordered w-full"
              />
            </div>
          )}

          {/* Actions */}
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

export default GetExpense;
