import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  FileText,
  ChevronRight,
  ShoppingBag,
  CheckCircle2,
  Check,
  Clock,
  Ticket,
  Tag,
  Calendar,
  TrendingUp,
  Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useGetVouchers } from '@/queries/voucher.query';
import AddressSelection from '@/components/checkout/address-selection';

interface Address {
  id: number;
  address: string;
  recipientName: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  default: boolean;
}

interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

interface Voucher {
  id: number;
  code: string;
  type: 'FIXED' | 'PERCENTAGE';
  percent?: number;
  amount?: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  startsAt: string;
  endsAt: string;
  usageLimit: number;
  usedCount: number;
  applyAllProducts: boolean;
  productIds: number[];
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  userAddresses: Address[];
  onCheckout: (checkoutData: any) => void;
  isPending: boolean;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  userAddresses,
  onCheckout,
  isPending
}: CheckoutModalProps) {
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [note, setNote] = useState('');
  const [requestDeliveryTime, setRequestDeliveryTime] = useState('');
  const [selectedVoucherCode, setSelectedVoucherCode] = useState<string | null>(
    null
  );
  const [showVoucherList, setShowVoucherList] = useState(false);

  const { data: resVouchers } = useGetVouchers();
  const vouchers = resVouchers?.data || [];
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Lọc và tính toán voucher khả dụng
  const availableVouchers = useMemo(() => {
    if (!vouchers) return [];
    console.log(vouchers);

    const now = new Date();
    const productIds = cartItems.map((item) => item.productId);

    return vouchers?.filter((voucher: Voucher) => {
      // Kiểm tra thời gian
      const startsAt = new Date(voucher.startsAt);
      const endsAt = new Date(voucher.endsAt);
      if (now < startsAt || now > endsAt) return false;

      // Kiểm tra usage limit
      if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit)
        return false;

      // Kiểm tra giá trị đơn hàng tối thiểu
      if (voucher.minOrderValue && totalAmount < voucher.minOrderValue)
        return false;

      // Kiểm tra sản phẩm áp dụng
      if (!voucher.applyAllProducts) {
        const hasApplicableProduct = productIds.some((id) =>
          voucher.productIds.includes(id)
        );
        if (!hasApplicableProduct) return false;
      }

      return true;
    });
  }, [vouchers, totalAmount, cartItems]);

  // Tính toán discount từ voucher đã chọn
  const discountAmount = useMemo(() => {
    if (!selectedVoucherCode || !vouchers) return 0;

    const selectedVoucher = vouchers.find(
      (v: Voucher) => v.code === selectedVoucherCode
    );
    if (!selectedVoucher) return 0;

    let discount = 0;
    if (selectedVoucher.type === 'FIXED') {
      discount = selectedVoucher.amount || 0;
    } else if (selectedVoucher.type === 'PERCENTAGE') {
      discount = totalAmount * ((selectedVoucher.percent || 0) / 100);
      // Áp dụng giới hạn discount tối đa nếu có
      if (selectedVoucher.maxDiscountAmount) {
        discount = Math.min(discount, selectedVoucher.maxDiscountAmount);
      }
    }

    return Math.min(discount, totalAmount); // Không cho discount vượt quá tổng đơn
  }, [selectedVoucherCode, vouchers, totalAmount]);

  const finalAmount = totalAmount - discountAmount;

  const handleNext = () => {
    if (!selectedAddress) {
      alert('Vui lòng chọn địa chỉ giao hàng');
      return;
    }
    setStep(2);
  };

  const handleConfirmCheckout = () => {
    if (!selectedAddress) {
      alert('Vui lòng chọn địa chỉ giao hàng');
      return;
    }

    const checkoutData = {
      note: note,
      requestDeliveryTime: requestDeliveryTime || null,
      voucherCode: selectedVoucherCode,
      returnUrl: window.location.origin + '/checkout/success',
      cancelUrl: window.location.origin + '/checkout/cancel',
      shippingAddress:
        selectedAddress.address?.specificAddress || selectedAddress.address,
      phoneNumber: selectedAddress.phone,
      recipientName: selectedAddress.name
    };

    onCheckout(checkoutData);
  };

  const handleClose = () => {
    setStep(1);
    setSelectedAddress(null);
    setNote('');
    setRequestDeliveryTime('');
    setSelectedVoucherCode(null);
    setShowVoucherList(false);
    onClose();
  };

  const handleSelectVoucher = (code: string) => {
    setSelectedVoucherCode(selectedVoucherCode === code ? null : code);
    setShowVoucherList(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 right-0 z-[101] w-[95%] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Header with Steps */}
            <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 p-6 text-white">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Đặt hàng</h2>
                <button
                  onClick={handleClose}
                  className="rounded-full p-2 transition-colors hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Steps Indicator */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold transition-all ${
                      step >= 1
                        ? 'bg-white text-rose-600'
                        : 'bg-white/30 text-white'
                    }`}
                  >
                    {step > 1 ? <Check className="h-5 w-5" /> : '1'}
                  </div>
                  <span className="text-sm font-medium">Địa chỉ giao hàng</span>
                </div>

                <ChevronRight className="h-5 w-5" />

                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold transition-all ${
                      step >= 2
                        ? 'bg-white text-rose-600'
                        : 'bg-white/30 text-white'
                    }`}
                  >
                    2
                  </div>
                  <span className="text-sm font-medium">Xác nhận</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto p-6">
              {/* Step 1: Shipping Address */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Address Selection */}
                  <AddressSelection
                    onAddressSelect={setSelectedAddress}
                    selectedAddressId={selectedAddress?.id}
                  />

                  {/* Ghi chú đơn hàng */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <FileText className="h-4 w-4" />
                      Ghi chú đơn hàng
                    </Label>
                    <Textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Ví dụ: Cẩn thận giúp tôi nhé, giao giờ hành chính..."
                      className="min-h-[80px] border-gray-200 focus:border-rose-400"
                    />
                  </div>

                  {/* Thời gian giao hàng mong muốn */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <Clock className="h-4 w-4" />
                      Thời gian giao hàng mong muốn
                    </Label>
                    <Input
                      type="datetime-local"
                      value={requestDeliveryTime}
                      onChange={(e) => setRequestDeliveryTime(e.target.value)}
                      className="border-gray-200 focus:border-rose-400"
                    />
                    <p className="text-xs text-gray-500">
                      Thời gian chỉ mang tính tham khảo, shop sẽ cố gắng giao
                      gần nhất có thể.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Order Confirmation */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <h3 className="mb-4 text-lg font-semibold text-gray-800">
                    Xác nhận đơn hàng
                  </h3>

                  {/* Shipping Info */}
                  <div className="rounded-xl border-2 border-rose-200 bg-rose-50/50 p-4">
                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-800">
                      <MapPin className="h-5 w-5 text-rose-600" />
                      Thông tin giao hàng
                    </h4>
                    {selectedAddress && (
                      <div className="space-y-2 text-sm text-gray-700">
                        <p>
                          <strong>Người nhận:</strong> {selectedAddress.name}
                        </p>
                        <p>
                          <strong>Số điện thoại:</strong>{' '}
                          {selectedAddress.phone}
                        </p>
                        <p>
                          <strong>Địa chỉ:</strong>{' '}
                          {selectedAddress.address?.specificAddress ||
                            selectedAddress.address}
                        </p>
                      </div>
                    )}

                    {(note || requestDeliveryTime) && (
                      <div className="mt-3 space-y-1 border-t border-rose-200 pt-3">
                        {note && (
                          <p className="text-sm text-gray-700">
                            <strong>Ghi chú:</strong> {note}
                          </p>
                        )}
                        {requestDeliveryTime && (
                          <p className="flex items-center gap-1 text-sm text-gray-700">
                            <Clock className="h-4 w-4 text-rose-600" />
                            <span>
                              <strong>Thời gian giao mong muốn:</strong>{' '}
                              {requestDeliveryTime}
                            </span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="rounded-xl border-2 border-gray-200 bg-white p-4">
                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-800">
                      <ShoppingBag className="h-5 w-5 text-rose-600" />
                      Sản phẩm ({totalItems})
                    </h4>
                    <div className="space-y-3">
                      {cartItems.map((item) => {
                        const imageSrc = (() => {
                          try {
                            const arr = JSON.parse(item.productImage);
                            return Array.isArray(arr) && arr[0] ? arr[0] : '';
                          } catch {
                            return '';
                          }
                        })();

                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 rounded-lg bg-gray-50 p-3"
                          >
                            <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-white">
                              {imageSrc ? (
                                <img
                                  src={imageSrc}
                                  alt={item.productName}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                                  No img
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {item.productName}
                              </p>
                              <p className="text-sm text-gray-600">
                                {formatPrice(item.unitPrice)} × {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold text-rose-600">
                              {formatPrice(item.lineTotal)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Voucher Section */}
                  <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="flex items-center gap-2 font-semibold text-gray-800">
                        <Ticket className="h-5 w-5 text-amber-600" />
                        Mã giảm giá
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowVoucherList(!showVoucherList)}
                        className="gap-2 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
                      >
                        <Gift className="h-4 w-4" />
                        {showVoucherList ? 'Ẩn' : 'Chọn voucher'}
                      </Button>
                    </div>

                    {selectedVoucherCode && (
                      <div className="mb-3 flex items-center gap-2 rounded-lg bg-white p-3 shadow-sm">
                        <Tag className="h-5 w-5 text-rose-600" />
                        <span className="flex-1 font-medium text-gray-900">
                          {selectedVoucherCode}
                        </span>
                        <span className="font-semibold text-rose-600">
                          -{formatPrice(discountAmount)}
                        </span>
                        <button
                          onClick={() => setSelectedVoucherCode(null)}
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
                          {availableVouchers.length > 0 ? (
                            availableVouchers.map((voucher: Voucher) => {
                              const isSelected =
                                selectedVoucherCode === voucher.code;
                              let discountText = '';
                              if (voucher.type === 'FIXED') {
                                discountText = `Giảm ${formatPrice(voucher.amount || 0)}`;
                              } else {
                                discountText = `Giảm ${voucher.percent}%`;
                                if (voucher.maxDiscountAmount) {
                                  discountText += ` (tối đa ${formatPrice(voucher.maxDiscountAmount)})`;
                                }
                              }

                              return (
                                <div
                                  key={voucher.id}
                                  onClick={() =>
                                    handleSelectVoucher(voucher.code)
                                  }
                                  className={`cursor-pointer rounded-lg border-2 p-3 transition-all hover:shadow-md ${
                                    isSelected
                                      ? 'border-rose-500 bg-rose-50'
                                      : 'border-amber-200 bg-white hover:border-amber-300'
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
                                      <Ticket className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <p className="font-bold text-gray-900">
                                            {voucher.code}
                                          </p>
                                          <p className="text-sm font-semibold text-rose-600">
                                            {discountText}
                                          </p>
                                        </div>
                                        {isSelected && (
                                          <CheckCircle2 className="h-5 w-5 text-rose-600" />
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
                                        <p className="flex items-center gap-1 text-xs text-gray-600">
                                          <Calendar className="h-3 w-3" />
                                          HSD: {formatDateTime(voucher.endsAt)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="rounded-lg bg-white p-4 text-center">
                              <p className="text-sm text-gray-600">
                                Không có voucher khả dụng cho đơn hàng này
                              </p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Total with Discount */}
                  <div className="space-y-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 p-4 text-white">
                    <div className="flex items-center justify-between text-sm">
                      <span>Tạm tính:</span>
                      <span className="font-semibold">
                        {formatPrice(totalAmount)}
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span>Giảm giá:</span>
                        <span className="font-semibold">
                          -{formatPrice(discountAmount)}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-white/30 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">
                          Tổng cộng:
                        </span>
                        <span className="text-2xl font-bold">
                          {formatPrice(finalAmount)}
                        </span>
                      </div>
                      {discountAmount > 0 && (
                        <p className="mt-1 text-right text-xs opacity-90">
                          Bạn đã tiết kiệm {formatPrice(discountAmount)}!
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-200 bg-gray-50 p-6">
              <div className="flex gap-3">
                {step === 1 ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleClose}
                      className="flex-1 border-gray-300 hover:bg-gray-100"
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="flex-1 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
                    >
                      Tiếp tục
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1 border-gray-300 hover:bg-gray-100"
                    >
                      Quay lại
                    </Button>
                    <Button
                      onClick={handleConfirmCheckout}
                      disabled={isPending}
                      className="flex-1 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
                    >
                      {isPending ? (
                        <span className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: 'linear'
                            }}
                            className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                          />
                          Đang xử lý...
                        </span>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Xác nhận đặt hàng
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
