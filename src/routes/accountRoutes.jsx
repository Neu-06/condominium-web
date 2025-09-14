import AccountLayout from '../layouts/AccountLayout.jsx';

export const accountRoutes = {
  path: '/mi',
  element: <AccountLayout />,
  children: [
    { index: true, element: <Perfil /> },
    { path: 'notificaciones', element: <Notificaciones /> },
  ],
};