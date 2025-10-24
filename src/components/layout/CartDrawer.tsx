import { X, Trash2, Plus, Minus, ShoppingBag, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (
    itemId: number,
    isAdd: boolean,
    quantity: number,
    productId: number
  ) => void;
  onRemoveItem: (itemId: number, productId: number) => void;
  onCheckout: () => void;
  isPending: boolean;
}

function getFirstImage(productImage: string): string {
  if (!productImage) return '';
  try {
    const arr = JSON.parse(productImage);
    if (Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'string') {
      return arr[0];
    }
    return '';
  } catch {
    return '';
  }
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  isPending
}: CartDrawerProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[999] flex h-full w-full flex-col bg-white shadow-2xl sm:w-[450px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-rose-600 to-pink-600 p-6 text-white">
              <div>
                <h2 className="flex items-center gap-2 text-2xl font-bold">
                  <ShoppingBag className="h-6 w-6" />
                  Giỏ hàng
                </h2>
                <p className="mt-1 text-sm text-pink-100">
                  {totalItems} sản phẩm
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 transition-colors hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-gray-400">
                  <ShoppingBag className="mb-4 h-20 w-20" />
                  <p className="text-lg">Giỏ hàng trống</p>
                  <p className="text-sm">Thêm sản phẩm để bắt đầu mua sắm</p>
                </div>
              ) : (
                cartItems.map((item) => {
                  const imageSrc = getFirstImage(item.productImage);
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="flex gap-4 rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                    >
                      {/* Product Image */}
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-white">
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={item.productName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
                            Không có ảnh
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-1 truncate font-semibold text-gray-900">
                          {item.productName}
                        </h3>
                        <p className="mb-3 text-sm font-bold text-emerald-600">
                          {formatPrice(item.unitPrice)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white">
                            <button
                              onClick={() =>
                                onUpdateQuantity(
                                  item.id,
                                  false,
                                  Math.max(1, item.quantity - 1),
                                  item.productId
                                )
                              }
                              className="rounded-l-lg p-2 transition-colors hover:bg-gray-50"
                            >
                              <Minus className="h-4 w-4 text-gray-600" />
                            </button>
                            <span className="min-w-[30px] text-center font-semibold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                onUpdateQuantity(
                                  item.id,
                                  true,
                                  1,
                                  item.productId
                                )
                              }
                              className="rounded-r-lg p-2 transition-colors hover:bg-gray-50"
                            >
                              <Plus className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>

                          <button
                            onClick={() =>
                              onRemoveItem(item.id, item.productId)
                            }
                            className="ml-auto rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="space-y-4 border-t border-gray-200 bg-white p-6">
                {/* Total */}
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold text-gray-700">
                    Tổng cộng:
                  </span>
                  <span className="text-2xl font-bold text-pink-600">
                    {formatPrice(totalAmount)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 rounded-xl border-2 border-gray-300 px-4 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Tiếp tục
                  </button>
                  <button
                    onClick={onCheckout}
                    className="flex-1 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:from-pink-700 hover:to-rose-700 hover:shadow-xl"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Đang tạo
                        đơn...
                      </div>
                    ) : (
                      <>Đặt hàng</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
