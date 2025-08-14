import React from "react";
import { useAuth } from "../providers/AuthContext";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";

const TotalExpense = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: expenses = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["expenses", user?._id],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/getExpenses/${user._id}`);
      return data;
    },
    enabled: !!user?._id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching expenses</div>;

  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  return (
    <div className="p-4 bg-white shadow rounded-lg w-full max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-2">Total Expense</h2>
      <p className="text-2xl text-blue-600 font-semibold">
        ${total.toFixed(2)}
      </p>
    </div>
  );
};

export default TotalExpense;
