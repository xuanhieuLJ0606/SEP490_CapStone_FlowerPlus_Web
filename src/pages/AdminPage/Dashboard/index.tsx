'use client';

import { useGetDashboard } from '@/queries/admin.query';
import { StatsCard } from './stats-card';
import { RevenueChart } from './revenue-chart';
import { OrdersChart } from './orders-chart';

export default function Dashboard() {
  const { data: dashboardData } = useGetDashboard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-rose-950">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-balance text-4xl font-bold text-slate-900 dark:text-white">
            Bảng điều khiển cửa hàng hoa
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Theo dõi bán hàng, sản phẩm và khách hàng của bạn
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Tổng doanh thu"
            value={`${(dashboardData?.totalRevenue || 0).toLocaleString('vi-VN')} ₫`}
            description="Từ tất cả các đơn hàng"
            icon="💰"
          />
          <StatsCard
            title="Tổng đơn hàng"
            value={dashboardData?.totalOrders || 0}
            description="Đơn hàng được tạo"
            icon="📦"
          />
          <StatsCard
            title="Tổng sản phẩm"
            value={dashboardData?.totalProducts || 0}
            description="Sản phẩm trong kho"
            icon="🌸"
          />
          <StatsCard
            title="Tổng khách hàng"
            value={dashboardData?.totalUsers || 0}
            description="Người dùng đã đăng ký"
            icon="👥"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Revenue Chart */}
          {dashboardData?.monthlyRevenue && (
            <RevenueChart data={dashboardData.monthlyRevenue} />
          )}

          {/* Orders Chart */}
          {dashboardData?.monthlyOrders && (
            <OrdersChart data={dashboardData.monthlyOrders} />
          )}
        </div>
      </main>
    </div>
  );
}
