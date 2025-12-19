import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tag,
  Calendar,
  Clock,
  ShoppingCart,
  Gift,
  Copy,
  CheckCircle,
  AlertCircle,
  Package
} from 'lucide-react';
import { toast } from 'sonner';

interface UserVoucher {
  userVoucherId: number;
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
      <DialogContent className="max-w-md">
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
