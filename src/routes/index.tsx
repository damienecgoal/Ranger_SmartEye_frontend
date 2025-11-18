import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// project-imports
import ComponentsRoutes from './ComponentsRoutes';
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';

import Loadable from 'components/Loadable';
import { SimpleLayoutType } from 'config';
import SimpleLayout from 'layout/Simple';
import DashboardLayout from 'layout/Dashboard';

// render - landing page
// const PagesLanding = Loadable(lazy(() => import('pages/alarm')));
const AuthLogin = Loadable(lazy(() => import('pages/auth/auth1/login')));
const LivePage = Loadable(lazy(() => import('pages/live')));

// ==============================|| ROUTES RENDER ||============================== //

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: <LivePage />
        }
      ]
    },
    LoginRoutes,
    ComponentsRoutes,
    MainRoutes
  ],
  { basename: import.meta.env.VITE_APP_BASE_NAME }
);

export default router;
