import AdminLayout from '../layouts/AdminLayout.jsx';
import DashboardHome from '../pages/dashboard/home.jsx';
import UsuariosPage from '../pages/dashboard/usuarios/cuentas.jsx';
import RolesPage from '../pages/dashboard/usuarios/roles.jsx';
import RolCreatePage from '../pages/dashboard/usuarios/RolCreatePage.jsx';
import RolEditPage from '../pages/dashboard/usuarios/RolEditPage.jsx'; 
import ResidentesPage from '../pages/dashboard/residentes/residentes.jsx';
import PersonalPage from "../pages/dashboard/personal/personal.jsx";
import TareasPage from "../pages/dashboard/personal/tareas.jsx";
import AreasPage from "../pages/dashboard/areas/areas.jsx";
import ReglasPage from "../pages/dashboard/areas/reglas.jsx";
import ProtectedRoute from "../components/routing/ProtectedRoute.jsx";

export const dashboardRoutes = [
  { path: '/dashboard', element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardHome /> },
      { path: 'usuarios', element: <UsuariosPage /> },
      { path: 'usuarios/roles', element: <RolesPage /> },
      { path: 'usuarios/roles/nuevo', element: <RolCreatePage /> },
      { path: 'usuarios/roles/:id/editar', element: <RolEditPage /> },

      { path: 'residentes', element: <ResidentesPage /> },
      { path:'/dashboard/personal', element:<PersonalPage/> },
      { path:'/dashboard/tareas', element:<TareasPage/> },
      { path:'/dashboard/areas', element:<AreasPage/> },
      { path:'/dashboard/reglas', element:<ReglasPage/> },
    ],
  },
  { path:'/dashboard', element: <ProtectedRoute roles={['ADMIN']}><DashboardHome /></ProtectedRoute> },
  { path:'/dashboard/residentes', element: <ProtectedRoute roles={['ADMIN']}><ResidentesPage /></ProtectedRoute> },
  { path:'/dashboard/personal', element: <ProtectedRoute roles={['ADMIN']}><PersonalPage /></ProtectedRoute> },
  { path:'/dashboard/tareas', element: <ProtectedRoute roles={['ADMIN']}><TareasPage /></ProtectedRoute> },
  { path:'/dashboard/areas', element: <ProtectedRoute roles={['ADMIN']}><AreasPage /></ProtectedRoute> },
  { path:'/dashboard/reglas', element: <ProtectedRoute roles={['ADMIN']}><ReglasPage /></ProtectedRoute> },
];