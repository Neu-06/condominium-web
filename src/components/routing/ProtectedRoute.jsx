import React from "react";
import { Navigate } from "react-router-dom";
import { getToken, getUser } from "../../services/auth.js";

export default function ProtectedRoute({ children, roles=[] }) {
  const token = getToken();
  if(!token) return <Navigate to="/login" replace />;
  const user = getUser();
  if(!user) return <Navigate to="/login" replace />;
  const rol = (user.rol || "").toUpperCase();
  if(roles.length && !roles.map(r=>r.toUpperCase()).includes(rol)){
    return <Navigate to="/" replace />;
  }
  return children;
}