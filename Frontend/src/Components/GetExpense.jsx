import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../providers/AuthContext";
import ExpenseTable from "./ExpenseTable";
import useAxiosSecure from "../hooks/useAxiosSecure";

const ExpenseManager = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch expenses
  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ["expenses", user?._id],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/getExpenses/${user?._id}`);
      return data;
    },
    enabled: !!user?._id,
  });

  // Apply filters
  const filteredExpenses = expenses.filter((exp) => {
    const matchesCategory = !categoryFilter || exp.category === categoryFilter;

    const matchesDate =
      (!startDate || new Date(exp.date) >= new Date(startDate)) &&
      (!endDate || new Date(exp.date) <= new Date(endDate));

    return matchesCategory && matchesDate;
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      {/* Filter Controls */}
      <div className="flex justify-center gap-4  py-16">
        <select
          className="select select-bordered"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Transport">Transport</option>
          <option value="Food">Food</option>
          <option value="Shopping">Shopping</option>
          <option value="Medical">Medical</option>
          <option value="Others">Others</option>
        </select>

        <input
          type="date"
          className="input input-bordered"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="date"
          className="input input-bordered"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* Expense Table */}
      <ExpenseTable expenses={filteredExpenses} queryClient={queryClient} />
    </div>
  );
};

export default ExpenseManager;
