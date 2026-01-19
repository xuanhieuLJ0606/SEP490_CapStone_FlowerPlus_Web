import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { CellAction } from './cell-action';

export type PersonalVoucher = {
  userVoucherId: number;
  userId: number;
  userName: string;
  userEmail: string;
  assignedAt: string;
  isUsed: boolean;
  usedAt?: string;
  createdBy: string;
  voucherId: number;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  percent?: number;
  amount?: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  startsAt?: string;
  endsAt?: string;
  usageLimit?: number;
  usedCount: number;
  applyAllProducts: boolean;
  productIds?: number[];
  isExpired: boolean;
  isActive: boolean;
  remainingUsage?: number;
};

export const columns: ColumnDef<PersonalVoucher>[] = [
  {
    accessorKey: 'code',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-semibold"
        >
          Mã voucher
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const voucher = row.original;
      return (
        <div className="font-medium">
          <div className="font-mono text-sm">{voucher.code}</div>
          <div className="text-xs text-gray-500">
            {voucher.type === 'PERCENTAGE'
              ? `${voucher.percent}% giảm`
              : `${voucher.amount?.toLocaleString()}đ giảm`}
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'userName',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-semibold"
        >
          Người dùng
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const voucher = row.original;
      return (
        <div>
          <div className="font-medium">{voucher.userName}</div>
          <div className="text-xs text-gray-500">{voucher.userEmail}</div>
        </div>
      );
    }
  },
  {
    accessorKey: 'assignedAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-semibold"
        >
          Ngày tạo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('assignedAt'));
      return (
        <div className="text-sm">
          {date.toLocaleDateString('vi-VN')}
          <div className="text-xs text-gray-500">
            {date.toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'isUsed',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const voucher = row.original;

      if (voucher.isUsed) {
        return <Badge variant="secondary">Đã sử dụng</Badge>;
      }

      if (voucher.isExpired) {
        return <Badge variant="destructive">Hết hạn</Badge>;
      }

      if (voucher.isActive) {
        return (
          <Badge variant="default" className="bg-green-500">
            Hoạt động
          </Badge>
        );
      }

      return <Badge variant="outline">Chưa kích hoạt</Badge>;
    }
  },
  {
    accessorKey: 'validity',
    header: 'Thời hạn',
    cell: ({ row }) => {
      const voucher = row.original;
      const startDate = voucher.startsAt ? new Date(voucher.startsAt) : null;
      const endDate = voucher.endsAt ? new Date(voucher.endsAt) : null;

      return (
        <div className="text-sm">
          <div>
            {startDate
              ? startDate.toLocaleDateString('vi-VN')
              : 'Không giới hạn'}
          </div>
          <div className="text-xs text-gray-500">
            đến{' '}
            {endDate ? endDate.toLocaleDateString('vi-VN') : 'Không giới hạn'}
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'usage',
    header: 'Sử dụng',
    cell: ({ row }) => {
      const voucher = row.original;

      if (!voucher.usageLimit) {
        return <span className="text-sm text-gray-500">Không giới hạn</span>;
      }

      return (
        <div className="text-sm">
          <div>
            {voucher.usedCount}/{voucher.usageLimit}
          </div>
          {voucher.remainingUsage !== undefined && (
            <div className="text-xs text-gray-500">
              Còn {voucher.remainingUsage}
            </div>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: 'applyAllProducts',
    header: 'Áp dụng',
    cell: ({ row }) => {
      const voucher = row.original;
      return (
        <div className="text-sm">
          {voucher.applyAllProducts ? (
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
              Tất cả sản phẩm
            </Badge>
          ) : (
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
              Giới hạn sản phẩm
            </Badge>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: 'createdBy',
    header: 'Tạo bởi',
    cell: ({ row }) => {
      return (
        <div className="text-sm font-medium">{row.getValue('createdBy')}</div>
      );
    }
  },
  {
    id: 'actions',
    header: 'Thao tác',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
