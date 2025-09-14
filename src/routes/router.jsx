import React from "react";
import {
  createBrowserRouter,
} from "react-router-dom";

import MainLayout from "../layouts/mainLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";

import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";

import DashboardHome from "../pages/dashboard/home.jsx";
import ResidentesPage from "../pages/dashboard/residentes/residentes.jsx";
import PersonalPage from "../pages/dashboard/personal/personal.jsx";
import TareasPage from "../pages/dashboard/personal/tareas.jsx";
import AreasPage from "../pages/dashboard/areas/areas.jsx";
import ReglasPage from "../pages/dashboard/areas/reglas.jsx";
import CuentasPage from "../pages/dashboard/usuarios/cuentas.jsx";
import RolesPage from "../pages/dashboard/usuarios/roles.jsx";
import RolCreatePage from "../pages/dashboard/usuarios/RolCreatePage.jsx";
import RolEditPage from "../pages/dashboard/usuarios/RolEditPage.jsx";

import ErrorBoundaryPage from "../pages/ErrorBoundaryPage.jsx";
import ProtectedRoute from "../components/routing/ProtectedRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorBoundaryPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ]
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute roles={['Admin', 'Administrador']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundaryPage />,
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "residentes", element: <ResidentesPage /> },
      { path: "personal", element: <PersonalPage /> },
      { path: "tareas", element: <TareasPage /> },
      { path: "areas", element: <AreasPage /> },
      { path: "areas/reglas", element: <ReglasPage /> },
      { path: "usuarios", element: <CuentasPage /> },
      { path: "usuarios/roles", element: <RolesPage /> },
      { path: "usuarios/roles/nuevo", element: <RolCreatePage /> },
      { path: "usuarios/roles/:id/editar", element: <RolEditPage /> },
    ]
  },
  { path: "*", element: <ErrorBoundaryPage /> }
]);

export { router };
