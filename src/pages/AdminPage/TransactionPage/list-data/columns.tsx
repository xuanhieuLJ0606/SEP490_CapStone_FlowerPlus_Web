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
    accessorKey: 'amount',
    header: 'Số tiền',
    enableSorting: true,
    cell: ({ row }) => {
      const value = row.original.amount ?? 0;
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
          className="text-blue-600 underline"
        >
          Link thanh toán
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
