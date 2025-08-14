import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useAuth } from "../providers/AuthContext";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"];

const ExpensePieChart = () => {
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

  if (isLoading) return <div>Loading chart...</div>;
  if (isError) return <div>Error fetching expenses</div>;

  // Aggregate expenses by category
  const categoryMap = {};
  expenses.forEach((expense) => {
    const category = expense.category || "Others";
    categoryMap[category] =
      (categoryMap[category] || 0) + Number(expense.amount);
  });

  const chartData = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  return (
    <div className="lg:px-28 lg:py-16 p-5">
      <h2 className="text-xl font-bold mb-6">Expenses by Category</h2>
      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpensePieChart;
