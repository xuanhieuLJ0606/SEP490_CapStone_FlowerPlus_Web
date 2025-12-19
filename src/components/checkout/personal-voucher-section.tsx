import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Gift,
  CheckCircle2,
  Calendar,
  TrendingUp,
  AlertCircle,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetMyActivePersonalVouchers } from '@/queries/personal-voucher.query';

interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

interface PersonalVoucher {
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

interface PersonalVoucherSectionProps {
  cartItems: CartItem[];
  totalAmount: number;
  selectedVoucherCode: string | null;
  onVoucherSelect: (code: string | null) => void;
  discountAmount: number;
}

export default function PersonalVoucherSection({
  cartItems,
  totalAmount,
  selectedVoucherCode,
  onVoucherSelect,
  discountAmount
}: PersonalVoucherSectionProps) {
  const [showVoucherList, setShowVoucherList] = useState(false);

  const { data: personalVouchersRes, isLoading } =
    useGetMyActivePersonalVouchers();
  const personalVouchers = personalVouchersRes?.data || [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'Không giới hạn';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Filter applicable personal vouchers
  const applicableVouchers = useMemo(() => {
    return personalVouchers.filter((voucher: PersonalVoucher) => {
      // Check if voucher is active
      if (!voucher.isActive || voucher.isUsed || voucher.isExpired) {
        return false;
      }

      // Check minimum order value
      if (voucher.minOrderValue && totalAmount < voucher.minOrderValue) {
        return false;
      }

      // Check product applicability
      if (!voucher.applyAllProducts) {
        // For now, assume personal vouchers apply to all products
        // In a real implementation, you'd check specific product IDs
        return true;
      }

      return true;
    });
  }, [personalVouchers, totalAmount]);

  const handleSelectVoucher = (code: string) => {
    const newCode = selectedVoucherCode === code ? null : code;
    onVoucherSelect(newCode);
    setShowVoucherList(false);
  };

  const getVoucherDiscountText = (voucher: PersonalVoucher) => {
    if (voucher.type === 'FIXED') {
      return `Giảm ${formatPrice(voucher.amount || 0)}`;
    }
    let text = `Giảm ${voucher.percent}%`;
    if (voucher.maxDiscountAmount) {
      text += ` (tối đa ${formatPrice(voucher.maxDiscountAmount)})`;
    }
    return text;
  };

  const selectedVoucher = personalVouchers.find(
    (v: PersonalVoucher) => v.code === selectedVoucherCode
  );

  if (isLoading) {
    return (
      <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="animate-pulse">
          <div className="mb-3 h-6 w-32 rounded bg-gray-200"></div>
          <div className="h-4 w-48 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (personalVouchers.length === 0) {
    return null; // Don't show section if no personal vouchers
  }

  return (
    <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="flex items-center gap-2 font-semibold text-gray-800">
          <Star className="h-5 w-5 text-purple-600" />
          Voucher Cá Nhân
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            {applicableVouchers.length}
          </Badge>
        </h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowVoucherList(!showVoucherList)}
          className="gap-2 text-purple-700 hover:bg-purple-100 hover:text-purple-800"
        >
          <Gift className="h-4 w-4" />
          {showVoucherList ? 'Ẩn' : 'Chọn voucher'}
        </Button>
      </div>

      {selectedVoucher && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-purple-200 bg-white p-3 shadow-sm">
          <Star className="h-5 w-5 text-purple-600" />
          <span className="flex-1 font-medium text-gray-900">
            {selectedVoucher.code}
          </span>
          <Badge className="bg-purple-600">Cá nhân</Badge>
          <span className="font-semibold text-purple-600">
            -{formatPrice(discountAmount)}
          </span>
          <button
            onClick={() => onVoucherSelect(null)}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      )}

      <AnimatePresence>
        {showVoucherList && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-2 overflow-hidden"
          >
            {applicableVouchers.length > 0 ? (
              applicableVouchers.map((voucher: PersonalVoucher) => {
                const isSelected = selectedVoucherCode === voucher.code;
                const discountText = getVoucherDiscountText(voucher);
                const isExpiringSoon =
                  voucher.daysUntilExpiry !== null &&
                  voucher.daysUntilExpiry !== undefined &&
                  voucher.daysUntilExpiry <= 7;

                return (
                  <div
                    key={voucher.userVoucherId}
                    onClick={() => handleSelectVoucher(voucher.code)}
                    className={`cursor-pointer rounded-lg border-2 p-3 transition-all hover:shadow-md ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-purple-200 bg-white hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-400 to-pink-500">
                        <Star className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-gray-900">
                                {voucher.code}
                              </p>
                              <Badge className="bg-purple-600 text-xs">
                                Cá nhân
                              </Badge>
                            </div>
                            <p className="text-sm font-semibold text-purple-600">
                              {discountText}
                            </p>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="h-5 w-5 text-purple-600" />
                          )}
                        </div>
                        <div className="mt-2 space-y-1">
                          {voucher.minOrderValue && (
                            <p className="flex items-center gap-1 text-xs text-gray-600">
                              <TrendingUp className="h-3 w-3" />
                              Đơn tối thiểu:{' '}
                              {formatPrice(voucher.minOrderValue)}
                            </p>
                          )}
                          <div className="flex items-center gap-3">
                            <p className="flex items-center gap-1 text-xs text-gray-600">
                              <Calendar className="h-3 w-3" />
                              HSD: {formatDateTime(voucher.endsAt)}
                            </p>
                            {isExpiringSoon && (
                              <p className="flex items-center gap-1 text-xs text-orange-600">
                                <AlertCircle className="h-3 w-3" />
                                Còn {voucher.daysUntilExpiry} ngày
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-lg border border-purple-200 bg-white p-4 text-center">
                <Star className="mx-auto mb-2 h-8 w-8 text-purple-300" />
                <p className="mb-1 text-sm text-gray-600">
                  Không có voucher cá nhân khả dụng
                </p>
                <p className="text-xs text-gray-500">
                  {personalVouchers.length > 0
                    ? 'Voucher không đủ điều kiện cho đơn hàng này'
                    : 'Bạn chưa có voucher cá nhân nào'}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
