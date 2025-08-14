import React from "react";
import { useAuth } from "../../providers/AuthContext";
import AddExpense from "../../Components/AddExpense";
import GetExpense from "../../Components/GetExpense";
import TotalExpense from "../../Components/TotalExpense";
import Recharts from "../../Components/Recharts";

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
      <h1 className="text-base pl-3.5">Name: {user?.username || "Guest"}</h1>
      <AddExpense />
      <TotalExpense />
      <GetExpense />
      <Recharts />
    </div>
  );
}
