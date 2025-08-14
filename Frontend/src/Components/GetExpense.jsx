import React from "react";
import { useAuth } from "../providers/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const GetExpense = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  //get expenses
  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ["expenses", user?._id],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:5000/getExpenses/${user._id}`
      );
      return data;
    },
    enabled: !!user?._id, // Only run if userId exists
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

  // Edit
  const editExpense = (expense) => {
    console.log("Editing:", expense);
    //  modal
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
                    <div className="badge badge-soft  badge-primary">
                      {" "}
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
    </div>
  );
};

export default GetExpense;
