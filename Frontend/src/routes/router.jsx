import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LogIn from "../pages/Authentication/Login";
import Registration from "../pages/Authentication/Registration";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LogIn></LogIn>,
  },
  {
    path: "/signUp",
    element: <Registration></Registration>,
  },
]);

export default router;
