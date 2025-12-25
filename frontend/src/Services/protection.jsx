import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

// Checks with backend if user is authenticated (registered)
const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  
  useEffect(() => {
    fetch(`${BACKEND_URL}/me`, {
      method: "GET",
      credentials: "include", // send cookies
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Not authenticated");
      })
      .then(() => {
        setAuthenticated(true);
      })
      .catch(() => {
        setAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return null; // or a loading spinner
  if (!authenticated) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;