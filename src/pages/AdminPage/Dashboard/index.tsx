'use client';

import { useState, useMemo } from 'react';
import { useGetDashboard } from '@/queries/admin.query';
import { useGetRefundRequests } from '@/queries/order.query';
import { StatsCard } from './stats-card';
import { RevenueChart } from './revenue-chart';
import { OrdersChart } from './orders-chart';
import { StatusBarChart } from './status-bar-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Dashboard() {
  const { data: dashboardData } = useGetDashboard();
  const { data: refundData } = useGetRefundRequests();
  const [activeTab, setActiveTab] = useState('store');

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
            Bảng điều khiển cửa hàng hoa
          </h1>
          <p className="mt-2 text-slate-600">
            Theo dõi bán hàng, sản phẩm và khách hàng của bạn
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="store">Thống kê cửa hàng</TabsTrigger>
            <TabsTrigger value="orders">Thống kê đơn hàng</TabsTrigger>
          </TabsList>

          <TabsContent value="store" className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatsCard
                title="Tổng doanh thu (Thành công)"
                value={`${(correctedDashboardData?.totalRevenue || 0).toLocaleString('vi-VN')} ₫`}
                description="Từ đơn hàng đã giao"
                icon="💰"
              />
              <StatsCard
                title="Tiền hoàn lại"
                value={`${(correctedDashboardData?.totalRefunded || 0).toLocaleString('vi-VN')} ₫`}
                description="Đơn hàng đã hoàn tiền"
                icon="💸"
              />
              <StatsCard
                title="Doanh thu ròng"
                value={`${(correctedDashboardData?.netRevenue || 0).toLocaleString('vi-VN')} ₫`}
                description="Doanh thu - Hoàn tiền"
                icon="📊"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatsCard
                title="Tổng đơn hàng"
                value={correctedDashboardData?.totalOrders || 0}
                description="Tất cả đơn hàng"
                icon="📦"
              />
              <StatsCard
                title="Tổng sản phẩm"
                value={correctedDashboardData?.totalProducts || 0}
                description="Sản phẩm trong kho"
                icon="🌸"
              />
              <StatsCard
                title="Tổng khách hàng"
                value={correctedDashboardData?.totalUsers || 0}
                description="Người dùng đã đăng ký"
                icon="👥"
              />
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>🏆</span>
                    Top 5 khách hàng mua nhiều nhất
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {correctedDashboardData?.topCustomers &&
                  correctedDashboardData.topCustomers.length > 0 ? (
                    <div className="space-y-3">
                      {correctedDashboardData.topCustomers.map(
                        (customer: any, index: number) => {
                          const totalSpent = parseFloat(
                            customer.totalspent || customer.totalSpent || 0
                          );
                          const orderCount = parseInt(
                            customer.ordercount || customer.orderCount || 0
                          );
                          return (
                            <div
                              key={customer.id}
                              className="flex items-center justify-between rounded-lg border p-3 hover:bg-slate-50"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-sm font-bold text-white">
                                  {index + 1}
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900">
                                    {customer.name || 'N/A'}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {customer.email || 'N/A'}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-slate-900">
                                  {totalSpent.toLocaleString('vi-VN')} ₫
                                </p>
                                <Badge variant="secondary" className="text-xs">
                                  {orderCount} đơn
                                </Badge>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <p className="text-center text-slate-500">
                      Chưa có dữ liệu
                    </p>
                  )}
                </CardContent>
              </Card>

              {correctedDashboardData?.monthlyRevenue && (
                <RevenueChart data={correctedDashboardData.monthlyRevenue} />
              )}
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
