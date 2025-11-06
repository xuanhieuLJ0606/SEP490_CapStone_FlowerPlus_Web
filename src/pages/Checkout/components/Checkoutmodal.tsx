import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  User,
  Phone,
  FileText,
  ChevronRight,
  ShoppingBag,
  CheckCircle2,
  Plus,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

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
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    userAddresses.find((addr) => addr.default)?.id || null
  );
  const [isNewAddress, setIsNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipientName: '',
    phoneNumber: '',
    address: '',
    province: '',
    district: '',
    ward: ''
  });
  const [note, setNote] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleNext = () => {
    if (isNewAddress) {
      // Validate new address
      if (
        !newAddress.recipientName ||
        !newAddress.phoneNumber ||
        !newAddress.address
      ) {
        alert('Vui lòng điền đầy đủ thông tin giao hàng');
        return;
      }
    } else {
      // Validate selected address
      if (!selectedAddressId) {
        alert('Vui lòng chọn địa chỉ giao hàng');
        return;
      }
    }
    setStep(2);
  };

  const handleConfirmCheckout = () => {
    const selectedAddress = userAddresses.find(
      (addr) => addr.id === selectedAddressId
    );

    const checkoutData = isNewAddress
      ? {
          shippingAddress: `${newAddress.address}, ${newAddress.ward}, ${newAddress.district}, ${newAddress.province}`,
          phoneNumber: newAddress.phoneNumber,
          recipientName: newAddress.recipientName,
          note: note,
          returnUrl: window.location.origin + '/checkout/success',
          cancelUrl: window.location.origin + '/checkout/cancel'
        }
      : {
          shippingAddress: `${selectedAddress?.address}, ${selectedAddress?.ward}, ${selectedAddress?.district}, ${selectedAddress?.province}`,
          phoneNumber: selectedAddress?.phoneNumber,
          recipientName: selectedAddress?.recipientName,
          note: note,
          returnUrl: window.location.origin + '/checkout/success',
          cancelUrl: window.location.origin + '/checkout/cancel'
        };

    onCheckout(checkoutData);
  };

  const handleClose = () => {
    setStep(1);
    setIsNewAddress(false);
    setNote('');
    onClose();
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
            className="bot-0 fixed bottom-0 right-0 z-[101] w-[95%] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl"
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
                  className="space-y-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Chọn địa chỉ giao hàng
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsNewAddress(!isNewAddress)}
                      className="gap-2 border-rose-300 text-rose-600 hover:bg-rose-50"
                    >
                      <Plus className="h-4 w-4" />
                      {isNewAddress
                        ? 'Chọn địa chỉ có sẵn'
                        : 'Thêm địa chỉ mới'}
                    </Button>
                  </div>

                  {!isNewAddress ? (
                    <RadioGroup
                      value={selectedAddressId?.toString()}
                      onValueChange={(value) =>
                        setSelectedAddressId(Number(value))
                      }
                      className="space-y-3"
                    >
                      {userAddresses.map((address) => (
                        <div
                          key={address.id}
                          className={`relative rounded-xl border-2 p-4 transition-all hover:shadow-md ${
                            selectedAddressId === address.id
                              ? 'border-rose-500 bg-rose-50'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <RadioGroupItem
                              value={address.id.toString()}
                              id={`address-${address.id}`}
                              className="mt-1"
                            />
                            <Label
                              htmlFor={`address-${address.id}`}
                              className="flex-1 cursor-pointer"
                            >
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-gray-600" />
                                  <span className="font-semibold text-gray-900">
                                    {address.recipientName}
                                  </span>
                                  {address.default && (
                                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
                                      Mặc định
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Phone className="h-4 w-4" />
                                  {address.phoneNumber}
                                </div>
                                <div className="flex items-start gap-2 text-sm text-gray-600">
                                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                  <span>
                                    {address.address}, {address.ward},{' '}
                                    {address.district}, {address.province}
                                  </span>
                                </div>
                              </div>
                            </Label>
                            {selectedAddressId === address.id && (
                              <CheckCircle2 className="h-5 w-5 text-rose-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <div className="space-y-4 rounded-xl border-2 border-rose-200 bg-rose-50/50 p-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm font-medium">
                          <User className="h-4 w-4" />
                          Tên người nhận *
                        </Label>
                        <Input
                          value={newAddress.recipientName}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              recipientName: e.target.value
                            })
                          }
                          placeholder="Nhập tên người nhận"
                          className="border-rose-200 focus:border-rose-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm font-medium">
                          <Phone className="h-4 w-4" />
                          Số điện thoại *
                        </Label>
                        <Input
                          value={newAddress.phoneNumber}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              phoneNumber: e.target.value
                            })
                          }
                          placeholder="Nhập số điện thoại"
                          className="border-rose-200 focus:border-rose-400"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Tỉnh/Thành phố
                          </Label>
                          <Input
                            value={newAddress.province}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                province: e.target.value
                              })
                            }
                            placeholder="Tỉnh/TP"
                            className="border-rose-200 focus:border-rose-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Quận/Huyện
                          </Label>
                          <Input
                            value={newAddress.district}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                district: e.target.value
                              })
                            }
                            placeholder="Quận/Huyện"
                            className="border-rose-200 focus:border-rose-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Phường/Xã
                          </Label>
                          <Input
                            value={newAddress.ward}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                ward: e.target.value
                              })
                            }
                            placeholder="Phường/Xã"
                            className="border-rose-200 focus:border-rose-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm font-medium">
                          <MapPin className="h-4 w-4" />
                          Địa chỉ chi tiết *
                        </Label>
                        <Textarea
                          value={newAddress.address}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              address: e.target.value
                            })
                          }
                          placeholder="Số nhà, tên đường..."
                          className="min-h-[80px] border-rose-200 focus:border-rose-400"
                        />
                      </div>
                    </div>
                  )}

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
                    {isNewAddress ? (
                      <div className="space-y-2 text-sm text-gray-700">
                        <p>
                          <strong>Người nhận:</strong>{' '}
                          {newAddress.recipientName}
                        </p>
                        <p>
                          <strong>Số điện thoại:</strong>{' '}
                          {newAddress.phoneNumber}
                        </p>
                        <p>
                          <strong>Địa chỉ:</strong> {newAddress.address},{' '}
                          {newAddress.ward}, {newAddress.district},{' '}
                          {newAddress.province}
                        </p>
                      </div>
                    ) : (
                      (() => {
                        const selectedAddress = userAddresses.find(
                          (addr) => addr.id === selectedAddressId
                        );
                        return (
                          <div className="space-y-2 text-sm text-gray-700">
                            <p>
                              <strong>Người nhận:</strong>{' '}
                              {selectedAddress?.recipientName}
                            </p>
                            <p>
                              <strong>Số điện thoại:</strong>{' '}
                              {selectedAddress?.phoneNumber}
                            </p>
                            <p>
                              <strong>Địa chỉ:</strong>{' '}
                              {selectedAddress?.address},{' '}
                              {selectedAddress?.ward},{' '}
                              {selectedAddress?.district},{' '}
                              {selectedAddress?.province}
                            </p>
                          </div>
                        );
                      })()
                    )}
                    {note && (
                      <div className="mt-3 border-t border-rose-200 pt-3">
                        <p className="text-sm text-gray-700">
                          <strong>Ghi chú:</strong> {note}
                        </p>
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
                                <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
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

                  {/* Total */}
                  <div className="rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">Tổng cộng:</span>
                      <span className="text-2xl font-bold">
                        {formatPrice(totalAmount)}
                      </span>
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
