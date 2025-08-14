import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LogIn from "../pages/Authentication/Login";
import Registration from "../pages/Authentication/Registration";
import Dashboard from "../pages/Dasboard/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LogIn></LogIn>,
  },
  {
    path: "/signUp",
    element: <Registration></Registration>,
  },
  {
    path: "/dashboard",
    element: <Dashboard></Dashboard>,
  },
]);

export default router;
