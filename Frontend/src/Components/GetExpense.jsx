import React, { useState } from "react";
import { useAuth } from "../providers/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import ExpenseTable from "./ExpenseTable";

const categories = ["Food", "Transport", "Shopping", "Medical", "Others"];

const ExpenseContainer = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editData, setEditData] = useState(null);

  // Fetch expenses
  const { data: expenses = [] } = useQuery({
    queryKey: ["expenses", user?._id],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:5000/getExpenses/${user?._id}`
      );
      return data;
    },
    enabled: !!user?._id,
  });

  const handleDelete = (id) => deleteMutation.mutate(id);

  // Delete
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`http://localhost:5000/deleteExpense/${id}`);
    },
    onSuccess: () => {
      toast.success("Expense deleted");
      queryClient.invalidateQueries(["expenses", user?._id]);
    },
    onError: () => toast.error("Failed to delete"),
  });

  // Edit open modal
  const handleEdit = (expense) => {
    setEditData(expense);
    document.getElementById("expense_modal").showModal();
  };

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

  return (
    <div className="py-16 px-32">
      <ExpenseTable
        expenses={expenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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

export default ExpenseContainer;
