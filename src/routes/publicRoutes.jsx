import MainLayout from '../layouts/mainLayout.jsx'; 
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';

export const publicRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    { index: true, element: <Home /> },
    { path: 'login', element: <Login /> },
    { path: 'register', element: <Register /> },
  ],
};