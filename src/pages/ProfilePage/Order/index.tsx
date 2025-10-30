import { useState } from 'react';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useGetOrdersByUser } from '@/queries/order.query';

const OrderHistoryProfile = () => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { data: resOrders, isPending } = useGetOrdersByUser();

  const orders = resOrders?.data;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusConfig = (status) => {
    const configs = {
      UNPAID: {
        label: 'Chưa thanh toán',
        icon: Clock,
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-800',
        borderColor: 'border-amber-300'
      },
      PAID: {
        label: 'Đã thanh toán',
        icon: CheckCircle,
        bgColor: 'bg-emerald-100',
        textColor: 'text-emerald-800',
        borderColor: 'border-emerald-300'
      },
      CANCELLED: {
        label: 'Đã hủy',
        icon: XCircle,
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-300'
      },
      PENDING: {
        label: 'Đang xử lý',
        icon: Clock,
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-300'
      }
    };
    return configs[status] || configs.PENDING;
  };

  const toggleOrder = (orderCode) => {
    setExpandedOrder(expandedOrder === orderCode ? null : orderCode);
  };
  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-fit  p-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Đơn hàng của tôi
              </h1>
              <p className="text-sm text-gray-600">
                Quản lý và theo dõi đơn hàng
              </p>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrder === order.orderCode;
            const statusConfig = getStatusConfig(order.status);
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
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="text-lg font-bold text-gray-900">
                          Đơn hàng #{order.orderCode}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border ${statusConfig.borderColor} ${statusConfig.bgColor} px-3 py-1 text-xs font-semibold ${statusConfig.textColor}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {statusConfig.label}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">
                            Tổng tiền:
                          </span>
                          <span className="text-lg font-bold text-rose-600">
                            {formatCurrency(order.total)}
                          </span>
                        </p>
                        <p>
                          <span className="font-medium text-gray-700">
                            Số lượng sản phẩm:
                          </span>{' '}
                          {order.items.length}
                        </p>
                      </div>
                    </div>

                    <button className="ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-rose-600 shadow-sm transition-all hover:bg-rose-50 hover:shadow-md">
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
                    {/* Items */}
                    <div className="p-6">
                      <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
                        Sản phẩm
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 rounded-xl border border-rose-100 bg-rose-50/50 p-4 transition-colors hover:bg-rose-50"
                          >
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md">
                              <Package className="h-8 w-8" />
                            </div>

                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-900">
                                {item.productName}
                              </h5>
                              <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
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
                        ))}
                      </div>
                    </div>

                    {/* Transactions */}
                    {order.transactions && order.transactions.length > 0 && (
                      <div className="border-t border-rose-100 bg-gradient-to-r from-rose-50/50 to-pink-50/50 p-6">
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
                          Thanh toán
                        </h4>
                        <div className="space-y-3">
                          {order.transactions.map((transaction, idx) => {
                            const transactionStatus = getStatusConfig(
                              transaction.status
                            );
                            const TransactionIcon = transactionStatus.icon;

                            return (
                              <div
                                key={idx}
                                className="flex items-center justify-between rounded-xl border border-rose-200 bg-white p-4 shadow-sm"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${transactionStatus.bgColor}`}
                                  >
                                    <TransactionIcon
                                      className={`h-5 w-5 ${transactionStatus.textColor}`}
                                    />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900">
                                      {formatCurrency(transaction.amount)}
                                    </p>
                                    <p
                                      className={`text-xs ${transactionStatus.textColor}`}
                                    >
                                      {transactionStatus.label}
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
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Order Summary */}
                    <div className="border-t border-rose-100  p-6">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-rose-600">
                          Tổng cộng
                        </span>
                        <span className="text-2xl font-bold text-rose-600">
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

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-rose-200 bg-white p-12">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100">
              <Package className="h-10 w-10 text-rose-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">
              Chưa có đơn hàng
            </h3>
            <p className="text-center text-gray-600">
              Bạn chưa có đơn hàng nào. Hãy khám phá và mua sắm ngay!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryProfile;
