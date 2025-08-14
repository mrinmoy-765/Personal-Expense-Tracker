import React, { useState } from "react";
import { useForm } from "react-hook-form";

const categories = ["Food", "Transport", "Shopping", "Medical", "Others"];

const AddExpense = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [expenses, setExpenses] = useState([]);

  const onSubmit = (data) => {
    setExpenses([...expenses, data]);
    reset();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Title */}
          <div>
            <input
              type="text"
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters",
                },
              })}
              placeholder="Expense title"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <input
              type="number"
              step="0.01"
              {...register("amount", {
                required: "Amount is required",
                min: {
                  value: 0.01,
                  message: "Amount must be greater than 0",
                },
              })}
              placeholder="Amount"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            />
            {errors.amount && (
              <p className="text-sm text-red-500 mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <select
              {...register("category", { required: "Category is required" })}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-500 mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <input
              type="date"
              {...register("date", { required: "Date is required" })}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            />
            {errors.date && (
              <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
