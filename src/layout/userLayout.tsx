import React, { useEffect, useRef, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Heart, Search, ChevronDown, LogIn, UserPlus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const UserLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userBtnRef = useRef<HTMLButtonElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  const navigation = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Sản phẩm', href: '/products' },
    { name: 'Về chúng tôi', href: '/about' },
    { name: 'Liên hệ', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        isUserMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(target) &&
        userBtnRef.current &&
        !userBtnRef.current.contains(target)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsUserMenuOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isUserMenuOpen]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all ${isScrolled ? 'bg-white/80 backdrop-blur shadow-lg' : 'bg-white shadow-md'}`}>
        {/* Top Bar */}
        <div className="bg-green-600 text-white py-2">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center text-sm">
              <div className="flex space-x-4">
                <span>📞 Hotline: 1900 1234</span>
                <span>📧 Email: info@flowerplus.com</span>
              </div>
              <div className="hidden md:flex space-x-4">
                <span>Miễn phí vận chuyển đơn hàng từ 500k</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className={`container mx-auto px-4 ${isScrolled ? 'py-3' : 'py-4'} transition-all`}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className={`rounded-full flex items-center justify-center bg-gradient-to-br from-green-600 to-emerald-500 text-white font-bold transition-all ${isScrolled ? 'w-9 h-9 shadow-md' : 'w-10 h-10 shadow-lg'} group-hover:scale-105`}>
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className={`font-bold text-green-700 transition-all ${isScrolled ? 'text-xl' : 'text-2xl'}`}>FlowerPlus</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive(item.href)
                      ? 'text-green-700 bg-green-50'
                      : 'text-gray-700 hover:text-green-700 hover:bg-green-50'
                  }`}
                >
                  {item.name}
                  <span className={`absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-green-600 transition-transform origin-left ${isActive(item.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                </Link>
              ))}
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Tìm kiếm hoa..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm hover:border-gray-300 transition"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Action Icons */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <button className="p-2 text-gray-700 hover:text-green-700 transition-colors rounded-full hover:bg-green-50">
                <Heart className="h-6 w-6" />
              </button>
              <button className="relative p-2 text-gray-700 hover:text-green-700 transition-colors rounded-full hover:bg-green-50">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full bg-green-600 text-white shadow">0</span>
              </button>
              <div className="relative">
                <button
                  ref={userBtnRef}
                  onClick={() => setIsUserMenuOpen((v) => !v)}
                  className={`flex items-center gap-1 p-1.5 rounded-full transition ${isUserMenuOpen ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:text-green-700 hover:bg-green-50'}`}
                  aria-haspopup="menu"
                  aria-expanded={isUserMenuOpen}
                >
                  <span className="p-2"><User className="h-6 w-6" /></span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      ref={userMenuRef}
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white shadow-xl overflow-hidden z-50"
                      role="menu"
                    >
                      <div className="p-1">
                        <Link
                          to="/auth/login"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 transition"
                          role="menuitem"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 text-green-700"><LogIn className="h-4 w-4" /></span>
                          <div>
                            <div className="text-sm font-semibold">Đăng nhập</div>
                            <div className="text-xs text-gray-500">Truy cập tài khoản của bạn</div>
                          </div>
                        </Link>
                        <Link
                          to="/auth/register"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 transition"
                          role="menuitem"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700"><UserPlus className="h-4 w-4" /></span>
                          <div>
                            <div className="text-sm font-semibold">Đăng ký</div>
                            <div className="text-xs text-gray-500">Tạo tài khoản mới</div>
                          </div>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-green-600 transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm hoa..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">F</span>
                </div>
                <span className="text-xl font-bold">FlowerPlus</span>
              </div>
              <p className="text-gray-400 text-sm">
                Chuyên cung cấp hoa tươi chất lượng cao với dịch vụ giao hàng tận nơi nhanh chóng và chuyên nghiệp.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  📘
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  📷
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  🐦
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Liên kết nhanh</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Trang chủ</Link></li>
                <li><Link to="/products" className="text-gray-400 hover:text-white transition-colors">Sản phẩm</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">Về chúng tôi</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Liên hệ</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Hỗ trợ khách hàng</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Hướng dẫn mua hàng</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Chính sách đổi trả</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Bảo hành</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Thông tin liên hệ</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>📍 123 Đường ABC, Quận XYZ, TP.HCM</p>
                <p>📞 Hotline: 1900 1234</p>
                <p>📧 Email: info@flowerplus.com</p>
                <p>🕒 Giờ làm việc: 8:00 - 22:00</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm">
                © 2024 FlowerPlus. Tất cả quyền được bảo lưu.
              </p>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Điều khoản sử dụng</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Chính sách bảo mật</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
