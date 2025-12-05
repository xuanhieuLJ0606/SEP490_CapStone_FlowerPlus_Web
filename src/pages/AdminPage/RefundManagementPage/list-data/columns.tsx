import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { useSearchParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const statusMap: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: 'Chờ xử lý',
    className: 'bg-yellow-100 text-yellow-800'
  },
  PROCESSING: {
    label: 'Đang xử lý',
    className: 'bg-blue-100 text-blue-800'
  },
  COMPLETED: {
    label: 'Đã hoàn tiền',
    className: 'bg-green-100 text-green-800'
  },
  REJECTED: {
    label: 'Từ chối',
    className: 'bg-red-100 text-red-800'
  }
};

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'STT',
    header: 'STT',
    enableSorting: false,
    cell: ({ row }) => {
      const [searchParams] = useSearchParams();
      const pageLimit = Number(searchParams.get('limit') || 10);
      const page = Number(searchParams.get('page') || 1);
      const rowIndex = row.index;
      const serialNumber = (page - 1) * pageLimit + rowIndex + 1;
      return <span className="font-medium">{serialNumber}</span>;
    }
  },
  {
    accessorKey: 'orderCode',
    header: 'Mã đơn hàng',
    enableSorting: true,
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.orderCode}</span>
    )
  },
  {
    accessorKey: 'userName',
    header: 'Khách hàng',
    enableSorting: true,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.userName}</span>
        <span className="text-xs text-gray-500">{row.original.userEmail}</span>
      </div>
    )
  },
  {
    accessorKey: 'refundAmount',
    header: 'Số tiền hoàn',
    enableSorting: true,
    cell: ({ row }) => (
      <span className="font-semibold text-green-600">
        {row.original.refundAmount.toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND'
        })}
      </span>
    )
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    enableSorting: true,
    cell: ({ row }) => {
      const status = row.original.status;
      const statusInfo = statusMap[status] || {
        label: status,
        className: 'bg-gray-100 text-gray-800'
      };
      return (
        <Badge className={`${statusInfo.className} border-0`}>
          {statusInfo.label}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'reason',
    header: 'Lý do hủy',
    enableSorting: false,
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate" title={row.original.reason}>
        {row.original.reason || 'N/A'}
      </span>
    )
  },
  {
    accessorKey: 'requestedAt',
    header: 'Ngày yêu cầu',
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-sm">
        {format(new Date(row.original.requestedAt), 'dd/MM/yyyy HH:mm', {
          locale: vi
        })}
      </span>
    )
  },
  {
    id: 'actions',
    header: 'Hành động',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
