import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { useSearchParams } from 'react-router-dom';

const statusMap: Record<string, string> = {
  UNPAID: 'Chưa thanh toán',
  PAID: 'Đã thanh toán',
  PENDING: 'Đang xử lý',
  CANCELLED: 'Đã huỷ'
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
    cell: ({ row }) => <span>{row.original.orderCode}</span>
  },
  {
    accessorKey: 'userInfo',
    header: 'Khách hàng',
    enableSorting: false,
    cell: ({ row }) => {
      const user = row.original.user || {};
      return (
        <div className="flex items-center gap-2">
          {user.avatar && (
            <img
              src={user.avatar}
              alt={user.firstName || 'Avatar'}
              className="h-8 w-8 rounded-full object-cover"
            />
          )}
          <div>
            <div className="font-semibold">
              {user.lastName} {user.firstName}
            </div>
            <div className="text-xs text-gray-500">{user.email}</div>
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
      return (
        <span>
          {value.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
          })}
        </span>
      );
    }
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    enableSorting: true,
    cell: ({ row }) => {
      const value = row.original.status;
      return <span>{statusMap[value] || value}</span>;
    }
  },
  {
    accessorKey: 'items',
    header: 'Sản phẩm',
    enableSorting: false,
    cell: ({ row }) => {
      const items = row.original.items || [];
      return (
        <div>
          {items.length === 0 && (
            <span className="text-gray-400">Không có</span>
          )}
          {items.map((item: any, idx: number) => (
            <div key={item.id || idx} className="my-1 flex items-center gap-2">
              {item.productImage && (
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="h-7 w-7 rounded object-cover"
                />
              )}
              <span className="line-clamp-1">{item.productName}</span>
              <span>x{item.quantity}</span>
              <span className="text-xs text-gray-600">
                (
                {item.unitPrice.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                })}
                )
              </span>
            </div>
          ))}
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
