import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tag,
  Calendar,
  Clock,
  ShoppingCart,
  Gift,
  Copy,
  CheckCircle,
  AlertCircle,
  Package,
  Receipt
} from 'lucide-react';
import { toast } from 'sonner';
import { useGetOrdersByVoucherId } from '@/queries/order.query';
import { Skeleton } from '@/components/ui/skeleton';

interface UserVoucher {
  userVoucherId: number;
  voucherId?: number;
  assignedAt: string;
  isUsed: boolean;
  usedAt?: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  percent?: number;
  amount?: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  startsAt?: string;
  endsAt?: string;
  usageLimit?: number;
  applyAllProducts: boolean;
  isExpired: boolean;
  isActive: boolean;
  status: string;
  daysUntilExpiry?: number;
}

interface VoucherDetailModalProps {
  voucher: UserVoucher | null;
  open: boolean;
  onClose: () => void;
}

export default function VoucherDetailModal({
  voucher,
  open,
  onClose
}: VoucherDetailModalProps) {
  if (!voucher) return null;

  const { data: ordersRes, isLoading: loadingOrders } = useGetOrdersByVoucherId(
    voucher.voucherId
  );
  const orders = ordersRes?.data || [];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(voucher.code);
    toast.success('Đã sao chép mã voucher!');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Không giới hạn';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const formatVoucherValue = () => {
    if (voucher.type === 'PERCENTAGE') {
      let text = `Giảm ${voucher.percent}%`;
      if (voucher.maxDiscountAmount) {
        text += ` (tối đa ${voucher.maxDiscountAmount.toLocaleString()}đ)`;
      }
      return text;
    }
    return `Giảm ${voucher.amount?.toLocaleString()}đ`;
  };

  const getStatusInfo = () => {
    switch (voucher.status) {
      case 'ACTIVE':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          text: 'Có thể sử dụng',
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        };
      case 'USED':
        return {
          icon: <Clock className="h-5 w-5 text-gray-600" />,
          text: 'Đã sử dụng',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50'
        };
      case 'EXPIRED':
        return {
          icon: <AlertCircle className="h-5 w-5 text-red-600" />,
          text: 'Đã hết hạn',
          color: 'text-red-600',
          bgColor: 'bg-red-50'
        };
      case 'NOT_STARTED':
        return {
          icon: <Clock className="h-5 w-5 text-orange-600" />,
          text: 'Chưa kích hoạt',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50'
        };
      default:
        return {
          icon: <AlertCircle className="h-5 w-5 text-gray-600" />,
          text: voucher.status,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-green-600" />
            Chi tiết voucher
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về voucher cá nhân của bạn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Voucher Code */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-green-300 bg-green-50 px-4 py-3">
              <Tag className="h-5 w-5 text-green-600" />
              <span className="font-mono text-xl font-bold text-green-700">
                {voucher.code}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyCode}
                className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Status */}
          <div
            className={`flex items-center justify-center gap-2 rounded-lg p-3 ${statusInfo.bgColor}`}
          >
            {statusInfo.icon}
            <span className={`font-medium ${statusInfo.color}`}>
              {statusInfo.text}
            </span>
          </div>

          {/* Voucher Value */}
          <div className="text-center">
            <div className="mb-1 text-3xl font-bold text-green-600">
              {formatVoucherValue()}
            </div>
            {voucher.minOrderValue && (
              <p className="text-sm text-gray-600">
                Áp dụng cho đơn hàng từ {voucher.minOrderValue.toLocaleString()}
                đ
              </p>
            )}
          </div>

          <Separator />

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div className="flex-1">
                <div className="text-sm font-medium">Thời gian hiệu lực</div>
                <div className="text-sm text-gray-600">
                  {formatDate(voucher.startsAt)} - {formatDate(voucher.endsAt)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Package className="h-4 w-4 text-gray-500" />
              <div className="flex-1">
                <div className="text-sm font-medium">Áp dụng cho</div>
                <div className="text-sm text-gray-600">
                  {voucher.applyAllProducts
                    ? 'Tất cả sản phẩm'
                    : 'Sản phẩm được chỉ định'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Gift className="h-4 w-4 text-gray-500" />
              <div className="flex-1">
                <div className="text-sm font-medium">Ngày nhận</div>
                <div className="text-sm text-gray-600">
                  {formatDate(voucher.assignedAt)}
                </div>
              </div>
            </div>

            {voucher.isUsed && voucher.usedAt && (
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-gray-500" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Ngày sử dụng</div>
                  <div className="text-sm text-gray-600">
                    {formatDate(voucher.usedAt)}
                  </div>
                </div>
              </div>
            )}

            {voucher.usageLimit && (
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gray-500" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Giới hạn sử dụng</div>
                  <div className="text-sm text-gray-600">
                    Tối đa {voucher.usageLimit} lần
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Expiry Warning */}
          {voucher.daysUntilExpiry !== null &&
            voucher.daysUntilExpiry !== undefined &&
            voucher.daysUntilExpiry <= 7 &&
            voucher.daysUntilExpiry > 0 && (
              <div className="flex items-center gap-2 rounded-lg bg-orange-50 p-3 text-orange-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Voucher sẽ hết hạn trong {voucher.daysUntilExpiry} ngày
                </span>
              </div>
            )}

          {/* Orders Section */}
          {voucher.isUsed && voucher.voucherId && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-gray-500" />
                  <h3 className="text-lg font-semibold">Đơn hàng đã sử dụng</h3>
                </div>
                {loadingOrders ? (
                  <div className="space-y-2">
                    {[...Array(2)].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : orders.length > 0 ? (
                  <div className="max-h-60 space-y-2 overflow-y-auto">
                    {orders.map((order: any) => (
                      <Card key={order.id}>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="mb-1 flex items-center gap-2">
                                <span className="font-mono text-sm font-medium">
                                  #{order.orderCode}
                                </span>
                                {order.transaction?.status === 'SUCCESS' && (
                                  <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">
                                    Đã thanh toán
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-600">
                                Tổng tiền:{' '}
                                <span className="font-semibold">
                                  {order.total.toLocaleString()}đ
                                </span>
                                {order.discountAmount > 0 && (
                                  <span className="ml-2 text-green-600">
                                    (Đã giảm:{' '}
                                    {order.discountAmount.toLocaleString()}đ)
                                  </span>
                                )}
                              </div>
                              <div className="mt-1 text-xs text-gray-500">
                                {new Date(order.createdAt).toLocaleString(
                                  'vi-VN'
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-sm text-gray-500">
                    Chưa có đơn hàng nào sử dụng voucher này
                  </div>
                )}
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Đóng
            </Button>
            {voucher.isActive && (
              <Button className="flex-1 bg-green-600 hover:bg-green-700">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Sử dụng ngay
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
