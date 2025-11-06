import { useState, useMemo } from 'react';
import {
  Package,
  Clock,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Truck,
  PackageCheck,
  AlertCircle,
  PackageX,
  Loader2
} from 'lucide-react';
import { useGetOrdersByUser } from '@/queries/order.query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const OrderHistoryProfile = () => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const itemsPerPage = 5;

  const { data: resOrders, isPending } = useGetOrdersByUser();
  const orders = resOrders?.data || [];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Lấy delivery status hiện tại dựa vào eventAt mới nhất
  const getCurrentDeliveryStatus = (deliveryStatuses: any) => {
    if (!deliveryStatuses || deliveryStatuses.length === 0) {
      return 'PENDING_CONFIRMATION';
    }

    const sortedStatuses = [...deliveryStatuses].sort((a, b) => {
      const aTime = new Date(a.eventAt).getTime();
      const bTime = new Date(b.eventAt).getTime();
      return bTime - aTime;
    });

    return sortedStatuses[0].step;
  };
  const getDeliveryStatusConfig = (step) => {
    const configs = {
      PENDING_CONFIRMATION: {
        label: 'Chờ xác nhận',
        icon: Clock,
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-800',
        borderColor: 'border-amber-300',
        gradient: 'from-amber-500 to-orange-600'
      },
      PREPARING: {
        label: 'Đang chuẩn bị',
        icon: Package,
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-300',
        gradient: 'from-blue-500 to-cyan-600'
      },
      DELIVERING: {
        label: 'Đang giao hàng',
        icon: Truck,
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-800',
        borderColor: 'border-purple-300',
        gradient: 'from-purple-500 to-pink-600'
      },
      DELIVERED: {
        label: 'Giao thành công',
        icon: PackageCheck,
        bgColor: 'bg-emerald-100',
        textColor: 'text-emerald-800',
        borderColor: 'border-emerald-300',
        gradient: 'from-emerald-500 to-green-600'
      },
      DELIVERY_FAILED: {
        label: 'Giao thất bại',
        icon: PackageX,
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-300',
        gradient: 'from-red-500 to-rose-600'
      }
    };
    return configs[step] || configs.PENDING_CONFIRMATION;
  };

  // Lọc và tìm kiếm đơn hàng
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Tìm kiếm theo mã order hoặc tên sản phẩm
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((order) => {
        const matchOrderCode = order.orderCode.toLowerCase().includes(query);
        const matchProductName = order.items.some((item) =>
          item.productName.toLowerCase().includes(query)
        );
        return matchOrderCode || matchProductName;
      });
    }

    // Lọc theo status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((order) => {
        const currentStatus = getCurrentDeliveryStatus(order.deliveryStatuses);
        return currentStatus === statusFilter;
      });
    }

    return filtered;
  }, [orders, searchQuery, statusFilter]);

  // Phân trang
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const toggleOrder = (orderCode) => {
    setExpandedOrder(expandedOrder === orderCode ? null : orderCode);
  };

  // Reset về trang 1 khi filter thay đổi
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  if (isPending) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-rose-600" />
          <p className="mt-4 text-gray-600">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg">
              <Package className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Đơn hàng của tôi
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Quản lý và theo dõi đơn hàng của bạn
              </p>
            </div>
          </div>

          {/* Bộ lọc và tìm kiếm */}
          <div className="rounded-2xl border border-rose-200 bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Filter className="h-4 w-4 text-rose-600" />
              <span>Lọc và tìm kiếm</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Tìm kiếm */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm theo mã đơn hàng hoặc tên sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="border-rose-200 pl-10 focus-visible:ring-rose-500"
                />
              </div>

              {/* Lọc theo trạng thái */}
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="border-rose-200 focus:ring-rose-500">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                  <SelectItem value="PENDING_CONFIRMATION">
                    Chờ xác nhận
                  </SelectItem>
                  <SelectItem value="PREPARING">Đang chuẩn bị</SelectItem>
                  <SelectItem value="DELIVERING">Đang giao hàng</SelectItem>
                  <SelectItem value="DELIVERED">Giao thành công</SelectItem>
                  <SelectItem value="DELIVERY_FAILED">Giao thất bại</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Thông tin kết quả */}
            <div className="mt-4 flex items-center justify-between border-t border-rose-100 pt-4">
              <p className="text-sm text-gray-600">
                Tìm thấy{' '}
                <span className="font-semibold text-rose-600">
                  {filteredOrders.length}
                </span>{' '}
                đơn hàng
              </p>
              {(searchQuery || statusFilter !== 'ALL') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                    setCurrentPage(1);
                  }}
                  className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {paginatedOrders.map((order) => {
            const isExpanded = expandedOrder === order.orderCode;
            const currentStatus = getCurrentDeliveryStatus(
              order.deliveryStatuses
            );
            const statusConfig = getDeliveryStatusConfig(currentStatus);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={order.orderCode}
                className="overflow-hidden rounded-2xl border border-rose-200 bg-white shadow-md transition-all hover:shadow-xl"
              >
                {/* Order Header */}
                <div
                  className="cursor-pointer bg-gradient-to-r from-rose-50 to-pink-50 p-6 transition-colors hover:from-rose-100 hover:to-pink-100"
                  onClick={() => toggleOrder(order.orderCode)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold text-gray-900">
                          Đơn hàng #{order.orderCode}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border ${statusConfig.borderColor} ${statusConfig.bgColor} px-3 py-1.5 text-xs font-semibold ${statusConfig.textColor} shadow-sm`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {statusConfig.label}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">
                            Tổng tiền:
                          </span>
                          <span className="text-xl font-bold text-rose-600">
                            {formatCurrency(order.total)}
                          </span>
                        </p>
                        <p>
                          <span className="font-medium text-gray-700">
                            Số lượng sản phẩm:
                          </span>{' '}
                          {order.items.length} sản phẩm
                        </p>
                      </div>
                    </div>

                    <button className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-rose-600 shadow-sm transition-all hover:bg-rose-50 hover:shadow-md">
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-rose-100 bg-white">
                    {/* Delivery Status Timeline */}
                    {order.deliveryStatuses &&
                      order.deliveryStatuses.length > 0 && (
                        <div className="border-b border-rose-100 bg-gradient-to-r from-rose-50/30 to-pink-50/30 p-6">
                          <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-700">
                            <Truck className="h-4 w-4 text-rose-600" />
                            Trạng thái giao hàng
                          </h4>
                          <div className="space-y-3">
                            {[...order.deliveryStatuses]
                              .sort(
                                (a: any, b: any) =>
                                  new Date(b.eventAt).getTime() -
                                  new Date(a.eventAt).getTime()
                              )
                              .map((status, idx) => {
                                const config = getDeliveryStatusConfig(
                                  status.step
                                );
                                const Icon = config.icon;
                                const isLatest = idx === 0;

                                return (
                                  <div
                                    key={status.id}
                                    className={`flex items-start gap-4 rounded-xl border ${config.borderColor} ${isLatest ? 'bg-white shadow-md' : 'bg-white/50'} p-4 transition-all`}
                                  >
                                    <div
                                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${config.gradient} shadow-md`}
                                    >
                                      <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <p
                                          className={`font-semibold ${config.textColor}`}
                                        >
                                          {config.label}
                                        </p>
                                        {isLatest && (
                                          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
                                            Mới nhất
                                          </span>
                                        )}
                                      </div>
                                      <p className="mt-1 text-xs text-gray-500">
                                        {new Date(
                                          status.eventAt
                                        ).toLocaleString('vi-VN')}
                                      </p>
                                      {status.note && (
                                        <p className="mt-2 text-sm text-gray-600">
                                          {status.note}
                                        </p>
                                      )}
                                      {status.location && (
                                        <p className="mt-1 text-xs text-gray-500">
                                          📍 {status.location}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}

                    {/* Items */}
                    <div className="p-6">
                      <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
                        Sản phẩm
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item) => {
                          const images = JSON.parse(item.productImage || '[]');
                          const mainImage = images[0] || null;

                          return (
                            <div
                              key={item.id}
                              className="flex items-center gap-4 rounded-xl border border-rose-100 bg-rose-50/50 p-4 transition-all hover:bg-rose-50 hover:shadow-sm"
                            >
                              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-md">
                                {mainImage ? (
                                  <img
                                    src={mainImage}
                                    alt={item.productName}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <Package className="h-8 w-8 text-rose-400" />
                                )}
                              </div>

                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-900">
                                  {item.productName}
                                </h5>
                                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                  <span>
                                    SL:{' '}
                                    <span className="font-medium text-gray-900">
                                      {item.quantity}
                                    </span>
                                  </span>
                                  <span>•</span>
                                  <span>
                                    Đơn giá:{' '}
                                    <span className="font-medium text-rose-600">
                                      {formatCurrency(item.unitPrice)}
                                    </span>
                                  </span>
                                </div>
                              </div>

                              <div className="text-right">
                                <p className="text-xs text-gray-500">
                                  Thành tiền
                                </p>
                                <p className="text-lg font-bold text-rose-600">
                                  {formatCurrency(item.lineTotal)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Transactions */}
                    {order.transactions && order.transactions.length > 0 && (
                      <div className="border-t border-rose-100 bg-gradient-to-r from-rose-50/50 to-pink-50/50 p-6">
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
                          Thanh toán
                        </h4>
                        <div className="space-y-3">
                          {order.transactions.map((transaction, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between rounded-xl border border-rose-200 bg-white p-4 shadow-sm"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {formatCurrency(transaction.amount)}
                                  </p>
                                  <p className="text-xs text-emerald-600">
                                    Đã thanh toán
                                  </p>
                                </div>
                              </div>

                              {transaction.checkoutUrl && (
                                <a
                                  href={transaction.checkoutUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:from-rose-600 hover:to-pink-700 hover:shadow-lg"
                                >
                                  Thanh toán
                                  <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Order Summary */}
                    <div className="border-t border-rose-100 bg-gradient-to-r from-rose-50 to-pink-50 p-6">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-700">
                          Tổng cộng
                        </span>
                        <span className="text-3xl font-bold text-rose-600">
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="border-rose-200 hover:bg-rose-50 disabled:opacity-50"
            >
              Trước
            </Button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={
                      currentPage === page
                        ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700'
                        : 'border-rose-200 hover:bg-rose-50'
                    }
                  >
                    {page}
                  </Button>
                )
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="border-rose-200 hover:bg-rose-50 disabled:opacity-50"
            >
              Sau
            </Button>
          </div>
        )}

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-rose-200 bg-white p-12">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100">
              <AlertCircle className="h-10 w-10 text-rose-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">
              {searchQuery || statusFilter !== 'ALL'
                ? 'Không tìm thấy đơn hàng'
                : 'Chưa có đơn hàng'}
            </h3>
            <p className="text-center text-gray-600">
              {searchQuery || statusFilter !== 'ALL'
                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                : 'Bạn chưa có đơn hàng nào. Hãy khám phá và mua sắm ngay!'}
            </p>
            {(searchQuery || statusFilter !== 'ALL') && (
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                  setCurrentPage(1);
                }}
                className="mt-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryProfile;
