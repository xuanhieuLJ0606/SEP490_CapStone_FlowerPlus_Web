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

export const columns: ColumnDef<any>[] = [
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
      return (
        <div className="min-w-[120px]">
          <div className="font-bold text-rose-600">
            {value.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND'
            })}
          </div>
          <div className="text-xs text-gray-500">{items.length} sản phẩm</div>
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
    accessorKey: 'deliveryStep',
    header: 'Giao hàng',
    enableSorting: false,
    cell: ({ row }) => {
      const deliveryStatuses = row.original.deliveryStatuses || [];
      return (
        <div className="min-w-[140px]">
          <DeliveryStatusCell deliveryStatuses={deliveryStatuses} />
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
