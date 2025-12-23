import NotFound from '@/pages/not-found';
import { Suspense, lazy } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

const DashboardLayout = lazy(
  () => import('@/components/layout/dashboard-layout')
);

const SignInPage = lazy(() => import('@/pages/auth/signin'));
const CompleteForgotPasswordPage = lazy(
  () => import('@/pages/auth/complete-forgot-password')
);
const VerifyEmailPage = lazy(() => import('@/pages/auth/verify-email'));
const HomePage = lazy(() => import('@/pages/HomePage/index'));
const ProductDetailPage = lazy(() => import('@/pages/ProductPage/index'));
const AdminLayout = lazy(() => import('@/components/layout/admin-layout'));
const CategoriesPage = lazy(
  () => import('@/pages/AdminPage/CategoriesPage/index')
);
const ItemsPage = lazy(() => import('@/pages/AdminPage/ItemsPage/index'));
const FlowersPage = lazy(() => import('@/pages/AdminPage/FlowersPage/index'));
const ProductsPage = lazy(() => import('@/pages/AdminPage/ProductsPage/index'));
const ProductCustom = lazy(() => import('@/pages/ProductCustom/index'));
const ListProduct = lazy(() => import('@/pages/ListProduct/index'));
const DashboardPage = lazy(() => import('@/pages/AdminPage/Dashboard/index'));
const StaffDashboardPage = lazy(
  () => import('@/pages/StaffPage/Dashboard/index')
);
const OrderPage = lazy(() => import('@/pages/AdminPage/OrderPage/index'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage/index'));
const TransactionPage = lazy(
  () => import('@/pages/AdminPage/TransactionPage/index')
);
const UserManagementPage = lazy(
  () => import('@/pages/AdminPage/UserManagmentPage/index')
);
const VouchersPage = lazy(() => import('@/pages/AdminPage/VouchersPage/index'));
const PersonalVouchersPage = lazy(
  () => import('@/pages/AdminPage/PersonalVouchersPage/index')
);
const RefundManagementPage = lazy(
  () => import('@/pages/AdminPage/RefundManagementPage/index')
);
const FavoritesPage = lazy(
  () => import('@/components/favorites/FavoritesPage')
);
const PaymentSuccessPage = lazy(() => import('@/pages/PaymentSuccess/index'));
const PaymentFailurePage = lazy(() => import('@/pages/PaymentFailure/index'));

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
        {
          path: '/product/:id',
          element: <ProductDetailPage />
        },
        {
          path: '/products/:categoryId',
          element: <ListProduct />
        },
        {
          path: '/products/search',
          element: <ListProduct />
        },
        {
          path: '/profile',
          element: <ProfilePage />
        },
        {
          path: '/favorites',
          element: <FavoritesPage />
        },
        {
          path: '/custom-product',
          element: <ProductCustom />
        }
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
          path: '/admin/dashboard',
          element: <DashboardPage />
        },
        {
          path: '/staff/dashboard',
          element: <StaffDashboardPage />
        },
        {
          path: '/admin/categories',
          element: <CategoriesPage />
        },
        {
          path: '/admin/items',
          element: <ItemsPage />
        },
        {
          path: '/admin/flowers',
          element: <FlowersPage />
        },
        {
          path: '/admin/products',
          element: <ProductsPage />
        },

        {
          path: '/admin/orders',
          element: <OrderPage />
        },
        {
          path: '/admin/payment',
          element: <TransactionPage />
        },
        {
          path: '/admin/profile',
          element: <ProfilePage />
        },
        {
          path: '/admin/user-management',
          element: <UserManagementPage />
        },
        {
          path: '/admin/vouchers',
          element: <VouchersPage />
        },
        {
          path: '/admin/personal-vouchers',
          element: <PersonalVouchersPage />
        },
        {
          path: '/admin/refunds',
          element: <RefundManagementPage />
        }
      ]
    }
  ];

  const publicRoutes = [
    {
      path: '/manager/login',
      element: <SignInPage />,
      index: true
    },
    {
      path: '/auth/forgot-password/:resetToken',
      element: <CompleteForgotPasswordPage />
    },
    {
      path: '/payment/success',
      element: <PaymentSuccessPage />
    },
    {
      path: '/payment/failure',
      element: <PaymentFailurePage />
    },
    {
      path: '/auth/verify-email/:verificationToken',
      element: <VerifyEmailPage />
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
