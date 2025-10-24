import {
  ShoppingCart,
  ChevronDown,
  LogIn,
  User,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import AuthModal from '@/components/shared/auth-modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import __helpers from '@/helpers';
import { useGetCategories } from '@/queries/categories.query';
import { useRouter } from '@/routes/hooks';
import { useGetMyInfo } from '@/queries/auth.query';
import {
  useAddItemToCart,
  useGetCart,
  useRemoveItemInCart,
  useUpdateItem
} from '@/queries/cart.query';
import CartDrawer from '@/components/layout/CartDrawer';
import { toast } from '../ui/use-toast';
import { useCheckout } from '@/queries/checkout.query';

const promoItems = [
  'Book Your Custom Floral Design',
  'Budget Estimator',
  "What if I ruin it? Let's talk."
];

export default function Header() {
  const [openAuth, setOpenAuth] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const { data: infoUser } = useGetMyInfo();
  const controls = useAnimationControls();
  const prefersReducedMotion = useReducedMotion();
  const { data: resCategories } = useGetCategories();
  const { data: resCart } = useGetCart();
  const cart = resCart?.data || [];

  const cartItems = cart?.items || [];
  const cartQty =
    cartItems?.reduce((sum: number, item: { quantity: number }) => {
      return sum + (item?.quantity ?? 0);
    }, 0) ?? 0;

  const categories = resCategories?.data || [];
  const router = useRouter();

  useEffect(() => {
    if (!prefersReducedMotion) {
      controls.start({
        x: ['0%', '-50%'],
        transition: { duration: 28, ease: 'linear', repeat: Infinity }
      });
    }
  }, [controls, prefersReducedMotion]);
  const { mutate: addItem } = useAddItemToCart();
  const { mutateAsync: updateItem } = useUpdateItem();
  const { mutate: removeItem } = useRemoveItemInCart();

  const handleUpdateQuantity = async (
    itemId: number,
    isAdd: boolean,
    quantity: number,
    productId: number
  ) => {
    if (isAdd) {
      addItem({ productId: productId, quantity: quantity });
    } else {
      updateItem({ id: itemId, quantity: quantity, productId: productId });
    }
  };
  const handleRemoveItem = async (itemId: number, productId: number) => {
    await removeItem({ id: itemId });
    toast({
      title: 'Xóa sản phẩm khỏi giỏ hàng thành công',
      description: 'Sản phẩm đã được xóa khỏi giỏ hàng',
      variant: 'success'
    });
  };
  const { mutateAsync: checkout, isPending } = useCheckout();

  const handleCheckout = async () => {
    const [err, data] = await checkout();

    if (err) {
      toast({
        title: 'Đặt hàng thất bại',
        description: err.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Đặt hàng thành công',
        description:
          'Đặt hàng thành công, vui lòng thanh toán để hoàn tất đơn hàng',
        variant: 'success'
      });
      console.log('data', data);
      window.open(data.checkoutUrl, '_blank');

      setOpenCart(false);
    }
  };

  return (
    <>
      <div className="sticky top-0 z-50 w-full bg-white shadow-sm">
        <div className="w-full bg-rose-400 text-white">
          <div className="mx-auto max-w-7xl px-4">
            <div className="marquee py-2 text-[11px] sm:text-xs">
              <motion.div
                className="no-scrollbar flex gap-6 whitespace-nowrap"
                animate={prefersReducedMotion ? undefined : controls}
                initial={false}
                onMouseEnter={() => controls.stop()}
                onMouseLeave={() => {
                  if (!prefersReducedMotion) {
                    controls.start({
                      x: ['0%', '-50%'],
                      transition: {
                        duration: 28,
                        ease: 'linear',
                        repeat: Infinity
                      }
                    });
                  }
                }}
                style={{ minWidth: '200%', willChange: 'transform' }}
              >
                {[...promoItems, ...promoItems].map((item, idx) => (
                  <Link
                    key={idx}
                    to="#"
                    className="mx-3 underline-offset-2 hover:underline"
                  >
                    {item}
                  </Link>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main navbar */}
        <div className="w-full border-b border-gray-100 bg-white">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-between py-3">
              <Link
                to="/"
                className="font-serif text-xl tracking-widest text-gray-800 sm:text-2xl"
              >
                FLOWER SHOP
              </Link>

              <nav className="hidden items-center justify-center gap-3 md:flex lg:gap-8">
                {categories?.map((cat) => (
                  <div key={cat.id} className="group relative">
                    <button
                      type="button"
                      className="flex items-center whitespace-nowrap rounded-t-md px-2 py-1 text-[20px] font-medium text-black transition-colors hover:font-bold hover:text-gray-900 sm:text-sm"
                      onClick={() => {
                        router.push(`/products/${cat.id}`);
                      }}
                    >
                      {cat.name}
                      {cat.children && cat.children.length > 0 && (
                        <ChevronDown className="ml-1 h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
                      )}
                    </button>
                    {cat.children && cat.children.length > 0 && (
                      <div className="invisible absolute left-0 top-full z-20 min-w-[240px] translate-y-2 rounded-md border border-gray-100 bg-white opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                        <ul className="py-2">
                          {cat.children.map((child) => (
                            <li key={child.id}>
                              <button
                                type="button"
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                onClick={() => {
                                  router.push(`/products/${child.id}`);
                                }}
                              >
                                {child.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Right icons */}
              <div className="flex items-center gap-1 sm:gap-2">
                {infoUser == null || infoUser == undefined ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setOpenAuth(true)}
                    aria-label="Đăng nhập"
                  >
                    <LogIn className="h-4 w-4" />
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative mr-3 h-8 w-8"
                      aria-label="Giỏ hàng"
                      onClick={() => setOpenCart(true)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {cartQty > 0 && (
                        <span
                          className="absolute -right-1 -top-1 inline-flex h-4 min-w-[16px]
                       items-center justify-center rounded-full bg-rose-500
                       px-[4px] text-[10px] font-semibold text-white"
                        >
                          {cartQty}
                        </span>
                      )}
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full border border-orange-200 hover:border-orange-300"
                          aria-label="Tài khoản"
                        >
                          <img
                            src={infoUser?.avatar}
                            alt="avatar"
                            className="h-8 w-8 rounded-full"
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="text-gray-700">
                          Xin chào, {infoUser?.name || 'bạn'}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link
                            to="/profile"
                            className="flex w-full items-center gap-2"
                          >
                            <User className="h-4 w-4" />
                            Hồ sơ
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link
                            to="/support"
                            className="flex w-full items-center gap-2"
                          >
                            <HelpCircle className="h-4 w-4" />
                            Hỗ trợ
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            __helpers.cookie_delete('AT');
                            window.location.reload();
                          }}
                        >
                          Thoát
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <AuthModal open={openAuth} onOpenChange={setOpenAuth} />
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={openCart}
        onClose={() => setOpenCart(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        isPending={isPending}
      />
    </>
  );
}
