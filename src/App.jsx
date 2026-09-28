import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Perception from "./pages/Perception";
import Snapshot from "./pages/Snapshot";
import Diagnosis from "./pages/Diagnosis";
import Dashboard from "./pages/Dashboard";
import Budget from "./pages/Budget";
import Expense from "./pages/Expense";
import Savings from "./pages/Savings";
import Debts from "./pages/Debts";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import { AppShell } from "./components/AppShell";

function Protected({ children }) {
  return localStorage.getItem("shekel_token") ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/perception" element={<Protected><Perception /></Protected>} />
      <Route path="/snapshot" element={<Protected><Snapshot /></Protected>} />
      <Route path="/diagnosis" element={<Protected><Diagnosis /></Protected>} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/expense" element={<Expense />} />
        <Route path="/savings" element={<Savings />} />
        <Route path="/debts" element={<Debts />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
