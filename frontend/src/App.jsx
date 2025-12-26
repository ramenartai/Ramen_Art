import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Components/Layout";
import HomePage from "./pages/HomePage.jsx";
import CharGen from "./pages/CharGen.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProtectedRoute from "./Services/protection.jsx";
import AuthCallback from "./Components/AuthCallBack.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />
      <Route path="/chargen" element={<CharGen />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/workspace" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;