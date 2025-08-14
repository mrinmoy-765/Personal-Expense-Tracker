import React from "react";
import { useAuth } from "../../providers/AuthContext";
import AddExpense from "../../Components/AddExpense";
import GetExpense from "../../Components/GetExpense";

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return <h2>Loading user...</h2>;
  }

  return (
    <div className="bg-gray-50">
      <h1 className="text-3xl font-bold text-slate-500 pl-3.5 pt-2">
        Dashboard
      </h1>
      <h1>Name: {user?.username || "Guest"}</h1>
      <h1>{user._id}</h1>
      <AddExpense />
      <GetExpense />
    </div>
  );
}
