import React from "react";
import { useAuth } from "../../providers/AuthContext";

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return <h2>Loading user...</h2>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <h1>Name: {user?.username || "Guest"}</h1>
    </div>
  );
}
