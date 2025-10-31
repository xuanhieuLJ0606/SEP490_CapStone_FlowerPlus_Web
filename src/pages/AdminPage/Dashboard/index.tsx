'use client';

import { StatCards } from './stat-cards';
import { SalesChart } from './sales-chart';
import { TopProductsChart } from './top-products-chart';
import { CustomerChart } from './customer-chart';
import { RevenueChart } from './revenue-chart';

export default function Dashboard() {
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

        {/* Stat Cards */}
        <StatCards />

        {/* Charts Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SalesChart />
          <RevenueChart />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TopProductsChart />
          <CustomerChart />
        </div>
      </main>
    </div>
  );
}
