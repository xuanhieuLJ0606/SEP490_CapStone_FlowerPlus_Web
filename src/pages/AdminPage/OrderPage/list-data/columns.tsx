import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { useSearchParams } from 'react-router-dom';
import { DeliveryStatusCell } from './DeliveryStatusCell';
import __helpers from '@/helpers';
import { Badge } from '@/components/ui/badge';

const statusMap: Record<string, string> = {
  UNPAID: 'Chưa thanh toán',
  PAID: 'Đã thanh toán',
  PENDING: 'Đang xử lý',
  SUCCESS: 'Thành công',
  FAILED: 'Thất bại',
  CANCELLED: 'Đã huỷ',
  CANCELED: 'Đã huỷ',
  EXPIRED: 'Hết hạn'
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    SUCCESS: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    PAID: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    PENDING: 'bg-amber-100 text-amber-800 border-amber-300',
    UNPAID: 'bg-rose-100 text-rose-800 border-rose-300',
    FAILED: 'bg-red-100 text-red-800 border-red-300',
    CANCELLED: 'bg-gray-100 text-gray-800 border-gray-300',
    CANCELED: 'bg-gray-100 text-gray-800 border-gray-300',
    EXPIRED: 'bg-orange-100 text-orange-800 border-orange-300'
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
};

export const createColumns = (refundData?: any): ColumnDef<any>[] => {
  // Tạo map orderId -> refund info để tra cứu nhanh
  const refundRequests = refundData?.data || [];
  const refundMap = new Map();

  refundRequests.forEach((refund: any) => {
    refundMap.set(refund.orderId, {
      amount: refund.refundAmount || 0,
      status: refund.status,
      reason: refund.reason
    });
  });

  return [
    {
      accessorKey: 'STT',
      header: 'STT',
      enableSorting: true,
      cell: ({ row }) => {
        const [searchParams] = useSearchParams();
        const pageLimit = Number(searchParams.get('limit') || 10);
        const page = Number(searchParams.get('page') || 1);
        const rowIndex = row.index;
        const serialNumber = (page - 1) * pageLimit + rowIndex + 1;
        return <span>{serialNumber}</span>;
      }
    },
    {
      accessorKey: 'orderCode',
      header: 'Mã đơn hàng',
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-mono font-semibold text-blue-600">
          #{row.original.orderCode}
        </span>
      )
    },
    {
      accessorKey: 'userInfo',
      header: 'Khách hàng',
      enableSorting: false,
      cell: ({ row }) => {
        const user = row.original.user || {};
        return (
          <div className="flex min-w-[180px] items-center gap-2">
            {user.avatar && (
              <img
                src={user.avatar}
                alt={user.firstName || 'Avatar'}
                className="h-10 w-10 rounded-full border-2 border-rose-200 object-cover"
              />
            )}
            <div className="overflow-hidden">
              <div className="truncate font-semibold">
                {user.lastName} {user.firstName}
              </div>
              <div className="truncate text-xs text-gray-500">{user.email}</div>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: 'total',
      header: 'Tổng tiền',
      enableSorting: true,
      cell: ({ row }) => {
        const value = row.original.total || 0;
        const items = row.original.items || [];
        const transaction = row.original.transaction;
        const orderId = row.original.id;

        // Kiểm tra trạng thái đơn hàng
        const isSuccessful =
          transaction?.status === 'SUCCESS' || transaction?.status === 'PAID';
        const isCancelled =
          transaction?.status === 'CANCELLED' ||
          transaction?.status === 'CANCELED' ||
          transaction?.status === 'FAILED';

        // Lấy thông tin refund
        const refundInfo = refundMap.get(orderId);
        const refundAmount = refundInfo?.amount || 0;
        const refundStatus = refundInfo?.status;

        let displayValue = value;
        let textColor = 'text-rose-600';
        let statusText = '';

        if (isCancelled) {
          displayValue = 0;
          textColor = 'text-gray-400 line-through';
          statusText = 'Đã hủy';
        } else if (refundStatus === 'COMPLETED') {
          // Hoàn tiền đã hoàn thành
          if (refundAmount >= value) {
            displayValue = 0;
            textColor = 'text-purple-600';
            statusText = 'Đã hoàn tiền';
          } else {
            displayValue = value - refundAmount;
            textColor = 'text-orange-600';
            statusText = `Hoàn ${refundAmount.toLocaleString('vi-VN')}₫`;
          }
        } else if (
          refundStatus === 'PENDING' ||
          refundStatus === 'PROCESSING'
        ) {
          // Đang chờ hoàn tiền
          textColor = 'text-blue-600';
          statusText =
            refundStatus === 'PENDING' ? 'Chờ hoàn tiền' : 'Đang hoàn tiền';
        } else if (refundStatus === 'REJECTED') {
          // Từ chối hoàn tiền
          if (isSuccessful) {
            textColor = 'text-green-600';
            statusText = 'Thành công (Từ chối hoàn tiền)';
          }
        } else if (isSuccessful) {
          textColor = 'text-green-600';
          statusText = 'Thành công';
        }

        return (
          <div className="min-w-[140px]">
            <div className={`font-bold ${textColor}`}>
              {displayValue.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND'
              })}
            </div>
            <div className="text-xs text-gray-500">
              {items.length} sản phẩm
              {statusText && (
                <span
                  className={`ml-1 ${
                    isCancelled
                      ? 'text-red-500'
                      : refundStatus === 'COMPLETED'
                        ? 'text-purple-500'
                        : refundStatus === 'PENDING' ||
                            refundStatus === 'PROCESSING'
                          ? 'text-blue-500'
                          : refundStatus === 'REJECTED'
                            ? 'text-orange-500'
                            : isSuccessful
                              ? 'text-green-500'
                              : 'text-gray-500'
                  }`}
                >
                  • {statusText}
                </span>
              )}
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: 'transaction.status',
      header: 'Thanh toán',
      enableSorting: true,
      cell: ({ row }) => {
        const transaction = row.original.transaction;
        const status = transaction?.status;
        return (
          <div className="min-w-[140px]">
            <Badge
              className={`${getStatusColor(status)} border font-semibold`}
              variant="outline"
            >
              {statusMap?.[status] ?? 'Không xác định'}
            </Badge>
            {transaction?.checkoutUrl && (
              <a
                href={transaction.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-xs text-blue-600 hover:underline"
              >
                Link thanh toán →
              </a>
            )}
          </div>
        );
      }
    },
    {
      accessorKey: 'shippingInfo',
      header: 'Thông tin giao hàng',
      enableSorting: false,
      cell: ({ row }) => {
        const shippingAddress = row.original.shippingAddress || '';
        const phoneNumber = row.original.phoneNumber || '';
        const recipientName =
          row.original.recipientName ||
          row.original.user?.firstName + ' ' + row.original.user?.lastName ||
          '';

        return (
          <div className="min-w-[200px] space-y-1">
            <div className="truncate font-semibold text-gray-900">
              {recipientName}
            </div>
            <div className="truncate text-sm text-gray-600">
              📞 {phoneNumber}
            </div>
            <div
              className="line-clamp-2 text-xs text-gray-500"
              title={shippingAddress}
            >
              📍 {shippingAddress}
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: 'deliveryStep',
      header: 'Trạng thái giao hàng',
      enableSorting: false,
      cell: ({ row }) => {
        const deliveryStatuses = row.original.deliveryStatuses || [];
        const orderId = row.original.id;
        return (
          <div className="min-w-[140px]">
            <DeliveryStatusCell
              deliveryStatuses={deliveryStatuses}
              orderId={orderId}
            />
          </div>
        );
      }
    },

    {
      accessorKey: 'createdAt',
      header: 'Ngày tạo',
      enableSorting: false,
      cell: ({ row }) => {
        const createdAt = row.original.createdAt;
        return <span>{__helpers.convertToDate(createdAt)}</span>;
      }
    },
    {
      accessorKey: 'requestDeliveryTime',
      header: 'Thời gian giao hàng',
      enableSorting: false,
      cell: ({ row }) => {
        const requestDeliveryTime = row.original.requestDeliveryTime;
        if (!requestDeliveryTime) {
          return <span className="text-gray-400">Chưa có</span>;
        }
        // Display in UTC+7 (Vietnam timezone)
        const date = new Date(requestDeliveryTime);

        return (
          <div className="min-w-[160px]">
            <div className="text-sm font-medium">
              {date.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                timeZone: 'Asia/Ho_Chi_Minh'
              })}
            </div>
            <div className="text-xs text-gray-500">
              {date.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Ho_Chi_Minh'
              })}
            </div>
          </div>
        );
      }
    },
    {
      id: 'actions',
      header: 'Hành động',
      cell: ({ row }) => <CellAction data={row.original} />
    }
  ];
};

// Export default columns for backward compatibility
export const columns = createColumns();
