import { ColumnDef } from '@tanstack/react-table';
import __helpers from '@/helpers';
import { useSearchParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { CellAction } from './cell-action';

export type Voucher = {
  id: number;
  code: string;
  type: 'FIXED' | 'PERCENTAGE';
  percent?: number | null;
  amount?: number | null;
  minOrderValue?: number | null;
  maxDiscountAmount?: number | null;
  startsAt?: string | null;
  endsAt?: string | null;
  usageLimit?: number | null;
  usedCount?: number | null;
  applyAllProducts: boolean;
  productIds: number[];
};

const formatCurrency = (value?: number | null) => {
  if (value == null) return '—';
  return value.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND'
  });
};

const formatPercent = (value?: number | null) => {
  if (value == null) return '—';
  return `${value}%`;
};

export const columns: ColumnDef<Voucher>[] = [
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
    accessorKey: 'code',
    header: 'Mã voucher',
    enableSorting: true,
    cell: ({ row }) => (
      <span className="font-semibold text-gray-900">{row.original.code}</span>
    )
  },
  {
    accessorKey: 'type',
    header: 'Loại',
    enableSorting: true,
    cell: ({ row }) => {
      const type = row.original.type;
      const map: Record<string, { label: string; className: string }> = {
        FIXED: {
          label: 'Giảm số tiền cố định',
          className: 'bg-indigo-100 text-indigo-700'
        },
        PERCENTAGE: {
          label: 'Giảm theo %',
          className: 'bg-emerald-100 text-emerald-700'
        }
      };
      const info = map[type] || {
        label: type,
        className: 'bg-gray-100 text-gray-700'
      };

      return (
        <Badge className={`${info.className} border-0 font-medium`}>
          {info.label}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'amount',
    header: 'Giá trị cố định',
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-sm text-gray-700">
        {formatCurrency(row.original.amount)}
      </span>
    )
  },
  {
    accessorKey: 'percent',
    header: 'Phần trăm giảm',
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-sm text-gray-700">
        {formatPercent(row.original.percent)}
      </span>
    )
  },
  {
    accessorKey: 'minOrderValue',
    header: 'Giá trị tối thiểu',
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-sm text-gray-700">
        {formatCurrency(row.original.minOrderValue)}
      </span>
    )
  },
  {
    accessorKey: 'maxDiscountAmount',
    header: 'Giảm tối đa',
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-sm text-gray-700">
        {formatCurrency(row.original.maxDiscountAmount)}
      </span>
    )
  },
  {
    accessorKey: 'startsAt',
    header: 'Bắt đầu',
    enableSorting: true,
    cell: ({ row }) => {
      const v = row.original.startsAt;
      if (!v)
        return <span className="text-sm text-gray-500">Chưa thiết lập</span>;
      return (
        <span className="text-sm text-gray-700">
          {__helpers.convertToDate(v)}
        </span>
      );
    }
  },
  {
    accessorKey: 'endsAt',
    header: 'Kết thúc',
    enableSorting: true,
    cell: ({ row }) => {
      const v = row.original.endsAt;
      if (!v)
        return <span className="text-sm text-gray-500">Chưa thiết lập</span>;
      return (
        <span className="text-sm text-gray-700">
          {__helpers.convertToDate(v)}
        </span>
      );
    }
  },
  {
    accessorKey: 'usageLimit',
    header: 'Giới hạn / Đã dùng',
    enableSorting: true,
    cell: ({ row }) => {
      const { usageLimit, usedCount } = row.original;
      return (
        <span className="text-sm text-gray-700">
          {usedCount ?? 0}
          {usageLimit != null ? ` / ${usageLimit}` : ' / ∞'}
        </span>
      );
    }
  },
  {
    accessorKey: 'applyAllProducts',
    header: 'Phạm vi áp dụng',
    enableSorting: true,
    cell: ({ row }) => {
      const { applyAllProducts } = row.original;
      return (
        <Badge
          className={`border-0 font-medium ${
            applyAllProducts
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
              : 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white'
          }`}
        >
          {applyAllProducts ? 'Tất cả sản phẩm' : 'Sản phẩm chọn lọc'}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'productIds',
    header: 'Số sản phẩm áp dụng',
    enableSorting: false,
    cell: ({ row }) => {
      const { applyAllProducts, productIds } = row.original;
      if (applyAllProducts) {
        return <span className="text-sm text-gray-700">Tất cả sản phẩm</span>;
      }
      const count = productIds?.length ?? 0;
      return <span className="text-sm text-gray-700">{count} sản phẩm</span>;
    }
  },
  {
    id: 'actions',
    header: 'Hành động',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
