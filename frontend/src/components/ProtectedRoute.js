import React from "react";
import { Route, Navigate, Routes } from "react-router-dom";

export default function ProtectedRoute({ children, loggedIn, ...props }) {
  return (
    <Routes>
      <Route
        {...props}
        element={loggedIn ? children : <Navigate to="/signin" />}
      />
    </Routes>
  );
}
