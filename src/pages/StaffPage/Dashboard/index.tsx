'use client';

import { useState, useMemo } from 'react';
import { useGetDashboard } from '@/queries/admin.query';
import { useGetRefundRequests } from '@/queries/order.query';
import { StatsCard } from './stats-card';
import { RevenueChart } from './revenue-chart';
import { OrdersChart } from './orders-chart';
import { StatusBarChart } from './status-bar-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function StaffDashboard() {
  const { data: dashboardData } = useGetDashboard();
  const { data: refundData } = useGetRefundRequests();
  const [activeTab, setActiveTab] = useState('sales');

  // Tính toán lại dữ liệu với refund thực tế
  const correctedDashboardData = useMemo(() => {
    if (!dashboardData || !refundData?.data) {
      return dashboardData;
    }

    // Tính tổng tiền hoàn lại từ bảng refund_request
    const completedRefunds = refundData.data.filter(
      (refund: any) => refund.status === 'COMPLETED'
    );
    const totalRefunded = completedRefunds.reduce(
      (sum: number, refund: any) => sum + (refund.refundAmount || 0),
      0
    );

    // Tính doanh thu ròng
    const netRevenue = (dashboardData.totalRevenue || 0) - totalRefunded;

    // Đếm số đơn hàng đã hoàn tiền
    const refundedOrders = completedRefunds.length;

    return {
      ...dashboardData,
      totalRefunded,
      netRevenue,
      refundedOrders
    };
  }, [dashboardData, refundData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-balance text-4xl font-bold text-slate-900">
            Bảng điều khiển bán hàng
          </h1>
          <p className="mt-2 text-slate-600">
            Theo dõi giao dịch, đơn hàng và hoàn tiền
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="sales">Thống kê bán hàng</TabsTrigger>
            <TabsTrigger value="orders">Thống kê đơn hàng</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatsCard
                title="Tổng doanh thu"
                value={`${(correctedDashboardData?.totalRevenue || 0).toLocaleString('vi-VN')} ₫`}
                description="Từ đơn hàng đã giao"
                icon="💰"
                color="green"
              />
              <StatsCard
                title="Tiền hoàn lại"
                value={`${(correctedDashboardData?.totalRefunded || 0).toLocaleString('vi-VN')} ₫`}
                description="Đơn hàng đã hoàn tiền"
                icon="💸"
                color="red"
              />
              <StatsCard
                title="Doanh thu ròng"
                value={`${(correctedDashboardData?.netRevenue || 0).toLocaleString('vi-VN')} ₫`}
                description="Doanh thu - Hoàn tiền"
                icon="📊"
                color="blue"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatsCard
                title="Tổng đơn hàng"
                value={correctedDashboardData?.totalOrders || 0}
                description="Tất cả đơn hàng"
                icon="📦"
                color="purple"
              />
              <StatsCard
                title="Đơn thành công"
                value={correctedDashboardData?.successfulOrders || 0}
                description="Đã giao hàng"
                icon="✅"
                color="green"
              />
              <StatsCard
                title="Đơn hoàn tiền"
                value={correctedDashboardData?.refundedOrders || 0}
                description="Đã hoàn lại"
                icon="🔄"
                color="yellow"
              />
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {correctedDashboardData?.monthlyRevenue && (
                <RevenueChart data={correctedDashboardData.monthlyRevenue} />
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>📋</span>
                    Tổng quan giao dịch
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="text-sm font-medium text-slate-600">
                          Tổng giao dịch
                        </p>
                        <p className="mt-1 text-2xl font-bold text-slate-900">
                          {correctedDashboardData?.totalOrders || 0}
                        </p>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <span className="text-2xl">💳</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="text-sm font-medium text-slate-600">
                          Giao dịch thành công
                        </p>
                        <p className="mt-1 text-2xl font-bold text-green-600">
                          {correctedDashboardData?.successfulOrders || 0}
                        </p>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <span className="text-2xl">✓</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="text-sm font-medium text-slate-600">
                          Giao dịch hoàn tiền
                        </p>
                        <p className="mt-1 text-2xl font-bold text-purple-600">
                          {correctedDashboardData?.refundedOrders || 0}
                        </p>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                        <span className="text-2xl">↩️</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        Đơn thành công
                      </p>
                      <p className="mt-2 text-3xl font-bold text-green-600">
                        {correctedDashboardData?.successfulOrders || 0}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Đã giao hàng
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-100"></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        Đang giao
                      </p>
                      <p className="mt-2 text-3xl font-bold text-blue-600">
                        {correctedDashboardData?.deliveringOrders || 0}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Đang vận chuyển
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-100"></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        Đang chờ
                      </p>
                      <p className="mt-2 text-3xl font-bold text-yellow-600">
                        {correctedDashboardData?.pendingOrders || 0}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">Chờ xử lý</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-yellow-100"></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        Đã hủy
                      </p>
                      <p className="mt-2 text-3xl font-bold text-red-600">
                        {correctedDashboardData?.failedOrders || 0}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">Đơn bị hủy</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-red-100"></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        Đã hoàn tiền
                      </p>
                      <p className="mt-2 text-3xl font-bold text-purple-600">
                        {correctedDashboardData?.refundedOrders || 0}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">Đã hoàn lại</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-purple-100"></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {correctedDashboardData && (
              <StatusBarChart
                data={{
                  successfulOrders:
                    correctedDashboardData.successfulOrders || 0,
                  deliveringOrders:
                    correctedDashboardData.deliveringOrders || 0,
                  pendingOrders: correctedDashboardData.pendingOrders || 0,
                  failedOrders: correctedDashboardData.failedOrders || 0,
                  refundedOrders: correctedDashboardData.refundedOrders || 0
                }}
              />
            )}

            <div className="grid grid-cols-1 gap-8">
              {correctedDashboardData?.monthlyOrdersByStatus && (
                <OrdersChart
                  data={correctedDashboardData.monthlyOrdersByStatus}
                  showByStatus={true}
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
