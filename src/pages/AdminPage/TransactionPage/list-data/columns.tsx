import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { useSearchParams } from 'react-router-dom';

const statusMap: Record<string, string> = {
  PENDING: 'Chờ thanh toán',
  SUCCESS: 'Thành công',
  FAILED: 'Thất bại',
  CANCELED: 'Đã hủy',
  EXPIRED: 'Hết hạn'
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
      <span className="font-medium">{row.original.orderCode}</span>
    )
  },
  {
    accessorKey: 'userName',
    header: 'Khách hàng',
    enableSorting: true,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.userName || 'N/A'}</span>
        <span className="text-xs text-gray-500">
          {row.original.userEmail || ''}
        </span>
      </div>
    )
  },
  {
    accessorKey: 'phoneNumber',
    header: 'SĐT khách hàng',
    enableSorting: true,
    cell: ({ row }) => <span>{row.original.phoneNumber || 'N/A'}</span>
  },
  {
    accessorKey: 'amount',
    header: 'Số tiền',
    enableSorting: true,
    cell: ({ row }) => {
      const value = row.original.amount ?? 0;
      return (
        <span className="font-semibold">
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
      const statusColors: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        SUCCESS: 'bg-green-100 text-green-800',
        FAILED: 'bg-red-100 text-red-800',
        CANCELED: 'bg-gray-100 text-gray-800',
        EXPIRED: 'bg-orange-100 text-orange-800'
      };
      return (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[value] || 'bg-gray-100 text-gray-800'}`}
        >
          {statusMap[value] || value}
        </span>
      );
    }
  },
  {
    accessorKey: 'shippingAddress',
    header: 'Địa chỉ giao hàng',
    enableSorting: false,
    cell: ({ row }) => (
      <span
        className="max-w-[200px] truncate"
        title={row.original.shippingAddress}
      >
        {row.original.shippingAddress || 'N/A'}
      </span>
    )
  },
  {
    accessorKey: 'checkoutUrl',
    header: 'Link thanh toán',
    enableSorting: false,
    cell: ({ row }) => {
      const url = row.original.checkoutUrl;
      return url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Xem link
        </a>
      ) : (
        <span className="text-gray-400">N/A</span>
      );
    }
  },
  {
    id: 'actions',
    header: 'Hành động',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
