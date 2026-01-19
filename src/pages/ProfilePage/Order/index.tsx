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
  Loader2,
  Image as ImageIcon,
  X,
  ExternalLinkIcon,
  User,
  Phone,
  MapPin,
  Eye,
  Flower2
} from 'lucide-react';
import { useGetOrdersByUser } from '@/queries/order.query';
import { useGetProductById } from '@/queries/product.query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import CancelOrderButton from '@/components/shared/cancel-order-button';

const OrderHistoryProfile = () => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [showProductModal, setShowProductModal] = useState(false);
  const itemsPerPage = 5;

  const { data: resOrders, isPending } = useGetOrdersByUser();
  const orders = resOrders?.data || [];

  // Query for product details when modal is opened
  const { data: productData, isLoading: isLoadingProduct } = useGetProductById(
    selectedProductId,
    {
      enabled: !!selectedProductId && showProductModal
    }
  );

  console.log(productData);

  // Định nghĩa thứ tự các bước giao hàng (từ nhỏ đến lớn)

  const deliveryStepOrder = [
    'PENDING_CONFIRMATION',
    'PREPARING',
    'DELIVERING',
    'DELIVERED',
    'DELIVERY_FAILED',
    'CANCELLED'
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Lấy delivery status hiện tại (step lớn nhất - cao nhất trong flow)
  const getCurrentDeliveryStatus = (deliveryStatuses: any) => {
    if (!deliveryStatuses || deliveryStatuses.length === 0) {
      return 'PENDING_CONFIRMATION';
    }

    // Tìm step có thứ tự lớn nhất trong deliveryStepOrder
    let maxStep = 'PENDING_CONFIRMATION';
    let maxIndex = 0;

    deliveryStatuses.forEach((status) => {
      const currentIndex = deliveryStepOrder.indexOf(status.step);
      if (currentIndex > maxIndex) {
        maxIndex = currentIndex;
        maxStep = status.step;
      }
    });

    return maxStep;
  };

  // Tạo timeline đầy đủ cho order dựa trên current status
  const generateTimeline = (deliveryStatuses: any[], currentStatus: string) => {
    if (!deliveryStatuses || deliveryStatuses.length === 0) {
      return [
        {
          step: 'PENDING_CONFIRMATION',
          isCurrent: true,
          isCompleted: false,
          hasData: false
        }
      ];
    }

    const currentIndex = deliveryStepOrder.indexOf(currentStatus);
    const timeline = [] as any;

    // Tạo timeline từ PENDING_CONFIRMATION đến currentStatus
    for (let i = 0; i <= currentIndex; i++) {
      const step = deliveryStepOrder[i];
      const statusData = deliveryStatuses.find((s) => s.step === step);

      timeline.push({
        step,
        isCurrent: step === currentStatus,
        isCompleted: i < currentIndex,
        hasData: !!statusData,
        data: statusData || null
      });
    }

    return timeline;
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
      },
      CANCELLED: {
        label: 'Đã hủy',
        icon: X,
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        borderColor: 'border-gray-300',
        gradient: 'from-gray-500 to-gray-600'
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

  const handleProductClick = (productId: number) => {
    setSelectedProductId(productId);
    setShowProductModal(true);
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
                  <SelectItem value="CANCELLED">Đã hủy</SelectItem>
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
            const timeline = generateTimeline(
              order.deliveryStatuses,
              currentStatus
            );

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
                        {order?.transaction?.checkoutUrl ? (
                          <a
                            href={order?.transaction?.checkoutUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-rose-600 hover:text-rose-700"
                          >
                            <p className="flex items-center gap-2 ">
                              <span className="font-medium text-gray-700">
                                Tổng tiền:
                              </span>

                              <span className="text-xl font-bold text-rose-600  hover:underline">
                                {formatCurrency(order.total)}
                              </span>
                              <ExternalLinkIcon className="h-4 w-4" />
                            </p>
                          </a>
                        ) : (
                          <p>Chờ link thanh toán</p>
                        )}
                        {/* <p>
                          <span className="font-medium text-gray-700">
                            Link thanh toán
                          </span>{' '}
                          <a
                            href={order?.transaction?.checkoutUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-rose-600 hover:text-rose-700"
                          >
                            tại đây
                          </a>
                        </p> */}
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
                    {/* Order Information */}
                    <div className="border-b border-rose-100 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 p-6">
                      <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-700">
                        <User className="h-4 w-4 text-blue-600" />
                        Thông tin đơn hàng
                      </h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {/* Recipient Information */}
                        <div className="rounded-xl border border-blue-200 bg-white/80 p-4">
                          <h5 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <User className="h-4 w-4 text-blue-600" />
                            Thông tin người nhận
                          </h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="font-medium text-gray-900">
                                {order.recipientName || 'Chưa cập nhật'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">
                                {order.phoneNumber || 'Chưa cập nhật'}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                              <span className="leading-relaxed text-gray-600">
                                {order.shippingAddress || 'Chưa cập nhật'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className="rounded-xl border border-blue-200 bg-white/80 p-4">
                          <h5 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Package className="h-4 w-4 text-blue-600" />
                            Chi tiết đơn hàng
                          </h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Mã đơn hàng:
                              </span>
                              <span className="font-medium text-gray-900">
                                #{order.orderCode}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Ngày đặt:</span>
                              <span className="font-medium text-gray-900">
                                {new Date(order.createdAt).toLocaleDateString(
                                  'vi-VN'
                                )}
                              </span>
                            </div>
                            {order.requestDeliveryTime && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Thời gian giao hàng mong muốn:
                                </span>
                                <span className="font-medium text-gray-900">
                                  {new Date(
                                    order.requestDeliveryTime
                                  ).toLocaleString('vi-VN', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    timeZone: 'Asia/Ho_Chi_Minh'
                                  })}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tổng tiền:</span>
                              <span className="font-bold text-rose-600">
                                {formatCurrency(order.total)}
                              </span>
                            </div>
                            {order.note && (
                              <div className="border-t border-blue-100 pt-2">
                                <span className="text-xs text-gray-600">
                                  Ghi chú:
                                </span>
                                <p className="mt-1 text-sm italic text-gray-900">
                                  "{order.note}"
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Status Timeline */}
                    <div className="border-b border-rose-100 bg-gradient-to-r from-rose-50/30 to-pink-50/30 p-6">
                      <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-700">
                        <Truck className="h-4 w-4 text-rose-600" />
                        Trạng thái đơn hàng
                      </h4>
                      <div className="space-y-3">
                        {[...timeline].reverse().map((timelineItem, idx) => {
                          const config = getDeliveryStatusConfig(
                            timelineItem.step
                          );
                          const Icon = config.icon;
                          const isLatest = timelineItem.isCurrent;
                          const statusData = timelineItem.data;

                          return (
                            <div
                              key={timelineItem.step}
                              className={`flex items-start gap-4 rounded-xl border ${
                                isLatest
                                  ? 'border-emerald-500 bg-emerald-50/50 shadow-md'
                                  : 'border-gray-300 bg-white/50'
                              } p-4 transition-all`}
                            >
                              <div
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                                  timelineItem.hasData
                                    ? `bg-gradient-to-br ${config.gradient} shadow-md`
                                    : 'bg-gray-200'
                                }`}
                              >
                                <Icon
                                  className={`h-6 w-6 ${timelineItem.hasData ? 'text-white' : 'text-gray-400'}`}
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p
                                    className={`font-semibold ${timelineItem.hasData ? config.textColor : 'text-gray-500'}`}
                                  >
                                    {config.label}
                                  </p>
                                  {isLatest && (
                                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                      Hiện tại
                                    </span>
                                  )}
                                  {timelineItem.isCompleted && (
                                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                                  )}
                                </div>
                                {statusData ? (
                                  <>
                                    <p className="mt-1 text-xs text-gray-500">
                                      {new Date(
                                        statusData.eventAt
                                      ).toLocaleString('vi-VN')}
                                    </p>
                                    {statusData.location && (
                                      <p className="mt-1 text-xs text-gray-500">
                                        📍 {statusData.location}
                                      </p>
                                    )}
                                  </>
                                ) : (
                                  <p className="mt-1 text-xs text-gray-400">
                                    Chưa cập nhật
                                  </p>
                                )}
                                {timelineItem.step === 'PREPARING' &&
                                  !timelineItem.isCompleted && (
                                    <span className="rounded-full py-0.5 text-xs font-medium text-red-500">
                                      Trong trường hợp bạn muốn hủy đơn, vui
                                      lòng liên hệ shop để được hỗ trợ.
                                    </span>
                                  )}
                              </div>

                              {/* Image thumbnail */}
                              {statusData?.imageUrl && (
                                <div className="shrink-0">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setZoomedImage(statusData.imageUrl);
                                    }}
                                    className="group relative h-20 w-20 overflow-hidden rounded-lg border-2 border-rose-200 bg-white shadow-sm transition-all hover:border-rose-400 hover:shadow-md"
                                  >
                                    <img
                                      src={statusData.imageUrl}
                                      alt={`Hình ảnh ${config.label}`}
                                      className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/20">
                                      <ImageIcon className="h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                                    </div>
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

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
                                <div className="flex items-center gap-2">
                                  <h5 className="font-semibold text-gray-900">
                                    {item.productName}
                                  </h5>
                                  <button
                                    onClick={() =>
                                      handleProductClick(item.productId)
                                    }
                                    className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-200"
                                  >
                                    <Eye className="h-3 w-3" />
                                    Chi tiết
                                  </button>
                                </div>
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

                      {/* Cancel Order Button */}
                      {currentStatus === 'PREPARING' && !order.cancelled && (
                        <div className="mt-4 border-t border-rose-100 pt-4">
                          <CancelOrderButton order={order} />
                        </div>
                      )}
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

      {/* Product Detail Modal */}
      <Dialog
        open={showProductModal}
        onOpenChange={(open) => {
          setShowProductModal(open);
          if (!open) {
            setSelectedProductId(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <Flower2 className="h-6 w-6 text-rose-600" />
              Chi tiết sản phẩm
            </DialogTitle>
          </DialogHeader>

          {isLoadingProduct ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-rose-600" />
                <p className="mt-4 text-gray-600">
                  Đang tải thông tin sản phẩm...
                </p>
              </div>
            </div>
          ) : productData?.data ? (
            <div className="space-y-6">
              {/* Product Basic Info */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
                    {(() => {
                      try {
                        const images = JSON.parse(
                          productData.data.images || '[]'
                        );
                        return images && images.length > 0 ? (
                          <img
                            src={images[0]}
                            alt={productData.data.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Package className="h-16 w-16 text-gray-400" />
                          </div>
                        );
                      } catch {
                        return (
                          <div className="flex h-full items-center justify-center">
                            <Package className="h-16 w-16 text-gray-400" />
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {productData.data.name}
                    </h3>
                    <p className="mt-2 text-3xl font-bold text-rose-600">
                      {formatCurrency(productData.data.price)}
                    </p>
                  </div>

                  {productData.data.description && (
                    <div>
                      <h4 className="mb-2 font-semibold text-gray-900">
                        Mô tả
                      </h4>
                      <p className="leading-relaxed text-gray-600">
                        {productData.data.description}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="rounded-lg bg-gray-50 p-3">
                      <span className="text-gray-600">Danh mục:</span>
                      <p className="font-medium text-gray-900">
                        {productData.data.categories &&
                        productData.data.categories.length > 0
                          ? productData.data.categories[0].name
                          : 'Chưa phân loại'}
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <span className="text-gray-600">Trạng thái:</span>
                      <p className="font-medium text-gray-900">
                        {productData.data.isActive ? 'Đang bán' : 'Ngừng bán'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="rounded-lg bg-gray-50 p-3">
                      <span className="text-gray-600">Tồn kho:</span>
                      <p className="font-medium text-gray-900">
                        {productData.data.stock || 0} sản phẩm
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <span className="text-gray-600">Loại:</span>
                      <p className="font-medium text-gray-900">
                        {productData.data.productType === 'PRODUCT'
                          ? 'Sản phẩm'
                          : 'Khác'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Composition */}
              {productData.data.compositions &&
                productData.data.compositions.length > 0 && (
                  <div>
                    <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <Flower2 className="h-5 w-5 text-rose-600" />
                      Thành phần cấu tạo
                    </h4>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {productData.data.compositions.map(
                        (composition, index) => {
                          const getCompositionImage = () => {
                            try {
                              const images = JSON.parse(
                                composition.childImage || '[]'
                              );
                              return images && images.length > 0
                                ? images[0]
                                : null;
                            } catch {
                              return null;
                            }
                          };

                          const compositionImage = getCompositionImage();
                          const isFlower = composition.childType === 'FLOWER';

                          return (
                            <div
                              key={index}
                              className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 transition-all hover:bg-rose-50 hover:shadow-sm"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
                                  {compositionImage ? (
                                    <img
                                      src={compositionImage}
                                      alt={composition.childName}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <Flower2
                                      className={`h-6 w-6 ${isFlower ? 'text-rose-600' : 'text-gray-400'}`}
                                    />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-semibold text-gray-900">
                                    {composition.childName}
                                  </h5>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span>SL:</span>
                                    <Badge
                                      variant="secondary"
                                      className="bg-rose-100 text-rose-700"
                                    >
                                      {composition.quantity}
                                    </Badge>
                                    <span>•</span>
                                    <span className="text-xs text-gray-500">
                                      {formatCurrency(composition.childPrice)}
                                    </span>
                                  </div>
                                  <div className="mt-1">
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${isFlower ? 'border-rose-300 text-rose-700' : 'border-gray-300 text-gray-600'}`}
                                    >
                                      {composition.childType === 'FLOWER'
                                        ? '🌸 Hoa'
                                        : '📦 Phụ kiện'}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

              {/* Additional Images */}
              {(() => {
                try {
                  const images = JSON.parse(productData.data.images || '[]');
                  return (
                    images &&
                    images.length > 1 && (
                      <div>
                        <h4 className="mb-4 text-lg font-semibold text-gray-900">
                          Hình ảnh khác
                        </h4>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                          {images.slice(1).map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setZoomedImage(image)}
                              className="group aspect-square overflow-hidden rounded-lg bg-gray-100 transition-all hover:shadow-md"
                            >
                              <img
                                src={image}
                                alt={`${productData.data.name} - ${index + 2}`}
                                className="h-full w-full object-cover transition-transform group-hover:scale-110"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  );
                } catch {
                  return null;
                }
              })()}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600">
                  Không thể tải thông tin sản phẩm
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setZoomedImage(null)}
        >
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          <div
            className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={zoomedImage}
              alt="Zoomed image"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
            <p className="text-sm text-white">Nhấn vào ngoài để đóng</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryProfile;
