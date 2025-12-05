import { useGetMyRefundRequests } from '@/queries/order.query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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

export default function RefundRequests() {
  const { data, isLoading } = useGetMyRefundRequests();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const refunds = data?.data || [];

  if (refunds.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-[200px] items-center justify-center">
          <p className="text-muted-foreground">
            Bạn chưa có yêu cầu hoàn tiền nào
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Yêu cầu hoàn tiền</h2>
        <p className="text-muted-foreground">
          Theo dõi trạng thái hoàn tiền của các đơn hàng đã hủy
        </p>
      </div>

      {refunds.map((refund: any) => (
        <Card key={refund.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Đơn hàng #{refund.orderCode}</CardTitle>
                <CardDescription>
                  Yêu cầu lúc:{' '}
                  {format(new Date(refund.requestedAt), 'dd/MM/yyyy HH:mm', {
                    locale: vi
                  })}
                </CardDescription>
              </div>
              <Badge
                className={`${statusMap[refund.status]?.className || 'bg-gray-100 text-gray-800'}`}
              >
                {statusMap[refund.status]?.label || refund.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Số tiền hoàn</p>
                <p className="text-lg font-semibold">
                  {refund.refundAmount.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  })}
                </p>
              </div>
              {refund.processedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Xử lý lúc</p>
                  <p className="text-sm">
                    {format(new Date(refund.processedAt), 'dd/MM/yyyy HH:mm', {
                      locale: vi
                    })}
                  </p>
                </div>
              )}
            </div>

            {refund.reason && (
              <div>
                <p className="text-sm font-medium">Lý do hủy:</p>
                <p className="text-sm text-muted-foreground">{refund.reason}</p>
              </div>
            )}

            {refund.adminNote && (
              <div>
                <p className="text-sm font-medium">Ghi chú từ admin:</p>
                <p className="text-sm text-muted-foreground">
                  {refund.adminNote}
                </p>
              </div>
            )}

            {refund.proofImageUrl && (
              <div>
                <p className="text-sm font-medium">Ảnh minh chứng:</p>
                <img
                  src={refund.proofImageUrl}
                  alt="Minh chứng hoàn tiền"
                  className="mt-2 max-w-md rounded-lg border"
                />
              </div>
            )}

            {refund.processedByName && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Xử lý bởi: {refund.processedByName}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
