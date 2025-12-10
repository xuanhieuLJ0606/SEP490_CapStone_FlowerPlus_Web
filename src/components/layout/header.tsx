import {
  ShoppingCart,
  ChevronDown,
  LogIn,
  User,
  HelpCircle,
  Flower,
  Search,
  Menu,
  X,
  ChevronRight
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
import {
  motion,
  useAnimationControls,
  useReducedMotion,
  AnimatePresence
} from 'framer-motion';
import __helpers from '@/helpers';
import { useGetCategories } from '@/queries/categories.query';
import { useRouter } from '@/routes/hooks';
import { useGetMyInfo } from '@/queries/auth.query';
import { useGetListProductByPaging } from '@/queries/product.query';
import { PRODUCT_TYPE } from '@/constants/data';
import {
  useAddItemToCart,
  useGetCart,
  useRemoveItemInCart,
  useUpdateItem
} from '@/queries/cart.query';
import CartDrawer from '@/components/layout/CartDrawer';
import { toast } from '../ui/use-toast';
import { useCheckout } from '@/queries/checkout.query';
import CheckoutModal from '@/pages/Checkout/components/Checkoutmodal';

interface CategoryWithChildren {
  id: number;
  name: string;
  children?: CategoryWithChildren[];
  image?: string;
  count?: number;
}

export default function Header() {
  const [openAuth, setOpenAuth] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(
        `/products/search?q=${encodeURIComponent(searchQuery.trim())}`
      );
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
      setShowSearchDropdown(false);
    }
  };

  // Search suggestions query
  const { data: searchData } = useGetListProductByPaging(
    1,
    5, // Limit to 5 suggestions
    searchQuery.trim(),
    PRODUCT_TYPE.PRODUCT,
    undefined
  );

  // Update search results when data changes
  useEffect(() => {
    if (searchData?.listObjects && searchQuery.trim()) {
      setSearchResults(searchData.listObjects);
      setShowSearchDropdown(true);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  }, [searchData, searchQuery]);

  // Handle clicking on a search suggestion
  const handleSearchSuggestionClick = (product: any) => {
    router.push(`/product/${product.id}`);
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  // Handle search input change
  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    if (!value.trim()) {
      setShowSearchDropdown(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.search-container')) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const { data: infoUser } = useGetMyInfo();
  const controls = useAnimationControls();
  const prefersReducedMotion = useReducedMotion();
  const { data: resCategories } = useGetCategories();
  const { data: resCart } = useGetCart();
  const cart = resCart?.data || [];
  const userAddress = infoUser?.deliveryAddresses || [];
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

  // Handle opening checkout modal from cart
  const handleProceedToCheckout = () => {
    setOpenCart(false);
    setOpenCheckout(true);
  };

  // Handle final checkout with shipping info
  const handleCheckout = async (checkoutData: any) => {
    const [err, data] = await checkout(checkoutData);

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
      setOpenCheckout(false);
    }
  };

  return (
    <>
      <div className="sticky top-0 z-50 w-full">
        <div className="animate-gradient-x overflow-hidden bg-gradient-to-r from-yellow-600 via-pink-400 to-rose-400 px-4 py-3 text-center text-sm font-medium text-white">
          <div className="animate-slide-in">
            🎉 Giảm Hoa Ngay Trong Khung Giờ 2 Tiếng! | Miễn phí giao hàng đơn
            từ 500.000đ
          </div>
        </div>

        {/* Main Header */}
        <header className="bg-white/95 shadow-md backdrop-blur-lg">
          <div className="mx-auto max-w-[1800px] px-6">
            {/* Top Header Row - All in one line */}
            <div className="relative flex items-center gap-4 py-4">
              {/* Logo */}
              <Link
                to="/"
                className="group flex flex-shrink-0 items-center gap-3"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-600 to-pink-600 shadow-lg"
                >
                  <Flower className="h-6 w-6 text-white" />
                </motion.div>
                <div className="hidden lg:block">
                  <h1 className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
                    FLOWER PLUS
                  </h1>
                  <p className="text-xs text-gray-500">
                    Hoa & Quà Tặng Cao Cấp
                  </p>
                </div>
              </Link>

              {/* Search Bar */}
              <div className="hidden flex-shrink-0 md:flex lg:w-64 xl:w-80">
                <div className="search-container group relative w-full">
                  <input
                    type="text"
                    placeholder="Tìm kiếm hoa, quà tặng..."
                    value={searchQuery}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    onFocus={() => {
                      if (searchQuery.trim() && searchResults.length > 0) {
                        setShowSearchDropdown(true);
                      }
                    }}
                    className="w-full rounded-full border-2 border-gray-200 py-2.5 pl-4 pr-10 text-sm outline-none transition-all duration-300 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 group-hover:border-purple-300"
                  />
                  <motion.button
                    onClick={handleSearch}
                    className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-2 text-white shadow-lg"
                  >
                    <Search className="h-4 w-4" />
                  </motion.button>

                  {/* Search Dropdown */}
                  <AnimatePresence>
                    {showSearchDropdown && searchResults.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-gray-200 bg-white shadow-2xl backdrop-blur-lg"
                      >
                        <div className="p-2">
                          <div className="mb-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Gợi ý tìm kiếm
                          </div>
                          {searchResults.map((product: any, index: number) => {
                            const images = product.images
                              ? JSON.parse(product.images)
                              : [];
                            const firstImage =
                              images.length > 0 ? images[0] : '';

                            return (
                              <motion.button
                                key={product.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() =>
                                  handleSearchSuggestionClick(product)
                                }
                                className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50"
                              >
                                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                  {firstImage ? (
                                    <img
                                      src={firstImage}
                                      alt={product.name}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                      <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate font-semibold text-gray-900">
                                    {product.name}
                                  </p>
                                  <p className="text-sm font-medium text-purple-600">
                                    {__helpers.formatCurrency(product.price)}
                                  </p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                              </motion.button>
                            );
                          })}

                          {searchQuery.trim() && (
                            <motion.button
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                              onClick={() => {
                                handleSearch();
                                setShowSearchDropdown(false);
                              }}
                              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-purple-200 p-3 text-purple-600 transition-all duration-200 hover:bg-purple-50"
                            >
                              <Search className="h-4 w-4" />
                              Xem tất cả kết quả cho "{searchQuery}"
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Categories Navigation */}
              <nav className="static hidden flex-1 lg:block">
                <ul className="flex items-center justify-end gap-4 whitespace-nowrap xl:gap-6">
                  {categories?.map(
                    (cat: CategoryWithChildren, catIndex: number) => {
                      // Check if this is one of the last 2 categories (align right to prevent overflow)
                      const isLastTwo = catIndex >= categories.length - 2;

                      return (
                        <li
                          key={cat.id}
                          className="relative flex-shrink-0"
                          onMouseEnter={() => setActiveCategory(cat.id)}
                          onMouseLeave={() => setActiveCategory(null)}
                        >
                          <button
                            type="button"
                            className="group relative flex items-center gap-1 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-rose-600 xl:text-base"
                            onClick={() => {
                              window.location.href = `/products/${cat.id}`;
                            }}
                          >
                            <span>{cat.name}</span>
                            {cat.children && cat.children.length > 0 && (
                              <motion.div
                                animate={{
                                  rotate: activeCategory === cat.id ? 180 : 0
                                }}
                                transition={{
                                  duration: 0.3,
                                  ease: [0.23, 1, 0.32, 1]
                                }}
                              >
                                <ChevronDown className="ml-1 h-4 w-4" />
                              </motion.div>
                            )}
                            <motion.span
                              initial={{ width: 0 }}
                              whileHover={{ width: '100%' }}
                              transition={{ duration: 0.3 }}
                              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-rose-600 to-pink-600"
                            ></motion.span>
                          </button>

                          {/* Mega Menu Dropdown */}
                          <AnimatePresence>
                            {cat.children &&
                              cat.children.length > 0 &&
                              activeCategory === cat.id && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{
                                    duration: 0.2,
                                    ease: [0.23, 1, 0.32, 1]
                                  }}
                                  className={`absolute top-full z-[100] w-[600px] max-w-[90vw] pt-6 ${
                                    isLastTwo
                                      ? 'right-0'
                                      : 'left-1/2 -translate-x-1/2'
                                  }`}
                                >
                                  <motion.div
                                    initial={{ scale: 0.95 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0.95 }}
                                    transition={{
                                      duration: 0.2,
                                      ease: [0.23, 1, 0.32, 1]
                                    }}
                                    className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-2xl backdrop-blur-lg"
                                  >
                                    {/* Decorative gradient border */}
                                    <motion.div
                                      initial={{ scaleX: 0 }}
                                      animate={{ scaleX: 1 }}
                                      transition={{ duration: 0.4, delay: 0.1 }}
                                      className="h-1 origin-left bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600"
                                    ></motion.div>

                                    <div className="p-6">
                                      {/* Subcategories Grid */}
                                      <div className="grid grid-cols-3 gap-4">
                                        {cat.children.map(
                                          (
                                            child: CategoryWithChildren,
                                            index: number
                                          ) => (
                                            <motion.button
                                              key={child.id}
                                              initial={{ opacity: 0, y: 10 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              transition={{
                                                duration: 0.3,
                                                delay: index * 0.05,
                                                ease: [0.23, 1, 0.32, 1]
                                              }}
                                              type="button"
                                              onClick={() => {
                                                router.push(
                                                  `/products/${child.id}`
                                                );
                                                setActiveCategory(null);
                                              }}
                                              className="group flex flex-col gap-3 rounded-2xl p-3 transition-all duration-300 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 hover:shadow-lg"
                                            >
                                              <div className="relative aspect-square overflow-hidden rounded-xl">
                                                <motion.img
                                                  whileHover={{ scale: 1.1 }}
                                                  transition={{
                                                    duration: 0.4,
                                                    ease: [0.23, 1, 0.32, 1]
                                                  }}
                                                  src={
                                                    child.image ||
                                                    'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=200&q=80'
                                                  }
                                                  alt={child.name}
                                                  className="h-full w-full object-cover"
                                                />
                                                <motion.div
                                                  initial={{ opacity: 0 }}
                                                  whileHover={{ opacity: 1 }}
                                                  transition={{ duration: 0.3 }}
                                                  className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
                                                ></motion.div>
                                              </div>
                                              <div className="min-h-[48px] overflow-hidden">
                                                <h4 className="mb-1 line-clamp-2 text-wrap text-sm font-semibold leading-tight text-gray-800 transition-colors group-hover:text-purple-600">
                                                  {child.name}
                                                </h4>
                                                {child.count && (
                                                  <p className="text-xs text-gray-500">
                                                    {child.count} sản phẩm
                                                  </p>
                                                )}
                                              </div>
                                            </motion.button>
                                          )
                                        )}
                                      </div>
                                    </div>

                                    {/* View All Link */}
                                    <motion.div
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ duration: 0.3, delay: 0.2 }}
                                      className="border-t border-purple-100 bg-gradient-to-r from-purple-50/50 to-pink-50/50 px-6 py-4"
                                    >
                                      <button
                                        type="button"
                                        onClick={() => {
                                          window.location.href = `/products/${cat.id}`;
                                          setActiveCategory(null);
                                        }}
                                        className="group flex w-full items-center justify-center gap-2 font-semibold text-purple-600"
                                      >
                                        Xem tất cả {cat.name}
                                        <motion.div
                                          whileHover={{ x: 4 }}
                                          transition={{ duration: 0.2 }}
                                        >
                                          <ChevronRight className="h-4 w-4" />
                                        </motion.div>
                                      </button>
                                    </motion.div>
                                  </motion.div>
                                </motion.div>
                              )}
                          </AnimatePresence>
                        </li>
                      );
                    }
                  )}
                </ul>
              </nav>

              {/* Header Actions */}
              <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
                {infoUser == null || infoUser == undefined ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 text-gray-700 hover:text-purple-600"
                      onClick={() => setOpenAuth(true)}
                      aria-label="Đăng nhập"
                    >
                      <LogIn className="h-5 w-5" />
                      <span className="hidden text-sm font-medium md:inline">
                        Đăng nhập
                      </span>
                    </Button>
                  </motion.div>
                ) : (
                  <>
                    {/* Custom Product Button */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        className="hidden items-center gap-2 bg-rose-500 text-white hover:bg-rose-600 sm:flex"
                        onClick={() =>
                          (window.location.href = '/custom-product')
                        }
                      >
                        <Flower className="h-4 w-4" />
                        Hoa custom
                      </Button>
                    </motion.div>

                    {/* Cart Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative rounded-full p-2 transition-all duration-300 hover:bg-purple-50"
                      onClick={() => setOpenCart(true)}
                      aria-label="Giỏ hàng"
                    >
                      <ShoppingCart className="h-6 w-6 text-gray-700 transition-colors group-hover:text-rose-600" />
                      <AnimatePresence>
                        {cartQty > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-xs font-bold text-white shadow-lg"
                          >
                            {cartQty}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    {/* User Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-full border-2 border-purple-200 hover:border-purple-300"
                            aria-label="Tài khoản"
                          >
                            <img
                              src={
                                infoUser?.avatar ||
                                'https://ui-avatars.com/api/?name=' +
                                  infoUser?.name
                              }
                              alt="avatar"
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          </Button>
                        </motion.div>
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

                {/* Mobile Menu Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="p-2 md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <AnimatePresence mode="wait">
                    {mobileMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="h-6 w-6" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="h-6 w-6" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden border-t border-gray-200 bg-white md:hidden"
            >
              <div className="mx-auto max-w-7xl px-4 py-4">
                {/* Mobile Search */}
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mb-4"
                >
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm..."
                      value={searchQuery}
                      onChange={(e) => handleSearchInputChange(e.target.value)}
                      onKeyPress={handleSearchKeyPress}
                      className="w-full rounded-full border-2 border-gray-200 py-2.5 pl-4 pr-10 outline-none focus:border-purple-400"
                    />
                    <button
                      onClick={handleSearch}
                      className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center p-1 text-gray-400 hover:text-purple-600"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>

                {/* Mobile Categories */}
                <nav className="space-y-2">
                  {categories?.map(
                    (cat: CategoryWithChildren, index: number) => (
                      <motion.div
                        key={cat.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                      >
                        <button
                          type="button"
                          onClick={() => router.push(`/products/${cat.id}`)}
                          className="w-full rounded-lg px-4 py-3 text-left font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        >
                          {cat.name}
                        </button>
                      </motion.div>
                    )
                  )}
                </nav>

                {/* Mobile Custom Product Button */}
                {infoUser && (
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      variant="outline"
                      className="mt-4 w-full bg-rose-500 text-white hover:bg-rose-600"
                      onClick={() => {
                        router.push('/custom-product');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Flower className="mr-2 h-4 w-4" />
                      Hoa custom
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AuthModal open={openAuth} onOpenChange={setOpenAuth} />
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={openCart}
        onClose={() => setOpenCart(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleProceedToCheckout}
        isPending={false}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={openCheckout}
        onClose={() => setOpenCheckout(false)}
        cartItems={cartItems}
        userAddresses={userAddress}
        onCheckout={handleCheckout}
        isPending={isPending}
      />
    </>
  );
}
