import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { useSearchParams } from 'react-router-dom';

const statusMap: Record<string, string> = {
  UNPAID: 'Chưa thanh toán',
  PAID: 'Đã thanh toán',
  PENDING: 'Đang xử lý',
  CANCELLED: 'Đã huỷ'
};

const deliveryStepMap: Record<string, string> = {
  PENDING_CONFIRMATION: 'Chờ xác nhận',
  PREPARING: 'Đang chuẩn bị',
  DELIVERING: 'Đang giao',
  DELIVERED: 'Giao thành công',
  DELIVERY_FAILED: 'Giao thất bại'
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
    accessorKey: 'transaction.status',
    header: 'Trạng thái thanh toán',
    enableSorting: true,
    cell: ({ row }) => {
      const transaction = row.original.transaction;
      const status = transaction?.status;
      return (
        <div>
          <a
            href={transaction?.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {statusMap?.[status] ?? (
              <span className="text-gray-400">Không xác định</span>
            )}
          </a>
          <p>
            Ngày tạo:{' '}
            {new Date(transaction?.createdAt).toLocaleDateString('vi-VN')}
          </p>
        </div>
      );
    }
  },
  {
    accessorKey: 'deliveryStep',
    header: 'Trạng thái giao hàng',
    enableSorting: false,
    cell: ({ row }) => {
      // deliveryStatuses là mảng các bước, lấy bước cuối cùng làm status hiện tại
      const deliveryStatuses = row.original.deliveryStatuses || [];
      let currentStep = '';
      if (deliveryStatuses.length > 0) {
        // tìm bản ghi eventAt lớn nhất
        const latest = deliveryStatuses.reduce((prev: any, curr: any) => {
          return new Date(prev.eventAt) > new Date(curr.eventAt) ? prev : curr;
        });
        currentStep = latest.step;
      }
      return (
        <span>
          {currentStep ? (
            deliveryStepMap[currentStep] || currentStep
          ) : (
            <span className="text-gray-400">Chưa có</span>
          )}
        </span>
      );
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
          {items.map((item: any, idx: number) => {
            // Sửa xử lý productImage là mảng hoặc chuỗi JSON mảng
            let image;
            if (typeof item.productImage === 'string') {
              try {
                const arr = JSON.parse(item.productImage);
                image =
                  Array.isArray(arr) && arr.length > 0 ? arr[0] : undefined;
              } catch (e) {
                image = item.productImage;
              }
            } else if (Array.isArray(item.productImage)) {
              image = item.productImage[0];
            } else {
              image = undefined;
            }
            return (
              <div
                key={item.id || idx}
                className="my-1 flex items-center gap-2"
              >
                {image && (
                  <img
                    src={image}
                    alt={item.productName}
                    className="h-7 w-7 rounded object-cover"
                  />
                )}
                <span className="line-clamp-1">{item.productName}</span>
                <span>x{item.quantity}</span>
                <span className="text-xs text-gray-600">
                  (
                  {item.unitPrice?.toLocaleString
                    ? item.unitPrice.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      })
                    : '0 ₫'}
                  )
                </span>
              </div>
            );
          })}
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