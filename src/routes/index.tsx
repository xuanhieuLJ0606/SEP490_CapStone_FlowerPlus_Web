import NotFound from '@/pages/not-found';
import { Suspense, lazy } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

const DashboardLayout = lazy(
  () => import('@/components/layout/dashboard-layout')
);

const SignInPage = lazy(() => import('@/pages/auth/signin'));
const HomePage = lazy(() => import('@/pages/HomePage/index'));
// const ProductDetailPage = lazy(() => import('@/pages/ProductPage/index'));
const AdminLayout = lazy(() => import('@/components/layout/admin-layout'));
const CategoriesPage = lazy(
  () => import('@/pages/AdminPage/CategoriesPage/index')
);

// ----------------------------------------------------------------------

export default function AppRouter() {
  const dashboardRoutes = [
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        {
          path: '/',
          element: <HomePage />,
          index: true
        },
        // {
        //   path: '/product/:id',
        //   element: <ProductDetailPage />
        // }
      ]
    }
  ];

  const adminRoutes = [
    {
      element: (
        <AdminLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </AdminLayout>
      ),
      children: [
        {
          path: '/admin/categories',
          element: <CategoriesPage />
        }
      ]
    }
  ];

  const publicRoutes = [
    {
      path: '/admin/login',
      element: <SignInPage />,
      index: true
    },

    {
      path: '/404',
      element: <NotFound />
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />
    }
  ];

  const routes = useRoutes([
    ...dashboardRoutes,
    ...publicRoutes,
    ...adminRoutes
  ]);

  return routes;
}