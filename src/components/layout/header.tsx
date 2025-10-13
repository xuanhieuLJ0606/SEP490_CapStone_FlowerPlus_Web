import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import {
  Clock,
  Search,
  Heart,
  User,
  LogIn,
  ShoppingCart,
  ChevronDown,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import AuthModal from '@/components/shared/auth-modal';
import { RootState } from '@/redux/store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import __helpers from '@/helpers';
import { useGetCategories } from '@/queries/categories.query';

// Chuẩn hóa cây danh mục từ API (id, name, parentId)
const processCategories = (cats: any[] = []) => {
  const map = new Map<number, any>();
  const roots: any[] = [];
  cats.forEach((c) => map.set(c.id, { ...c, children: [] }));
  cats.forEach((c) => {
    if (c.parentId != null) {
      const p = map.get(c.parentId);
      if (p) p.children.push(map.get(c.id));
    }
  });
  cats.forEach((c) => {
    if (c.parentId == null) roots.push(map.get(c.id));
  });
  return roots;
};

const promoItems = [
  'Book Your Custom Floral Design',
  'Budget Estimator',
  "What if I ruin it? Let's talk.",
];

export default function Header() {
  const [openAuth, setOpenAuth] = useState(false);
  const { infoUser } = useSelector((state: RootState) => state.auth);

  const controls = useAnimationControls();
  const prefersReducedMotion = useReducedMotion();

  const { data: resCategories } = useGetCategories();
  const processedCategories = processCategories(resCategories?.data || []);

  useEffect(() => {
    if (!prefersReducedMotion) {
      controls.start({
        x: ['0%', '-50%'],
        transition: { duration: 28, ease: 'linear', repeat: Infinity },
      });
    }
  }, [controls, prefersReducedMotion]);

  return (
    <div className="w-full bg-white">

      {/* Promo marquee */}
      <div className="w-full bg-rose-400 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="py-2 text-[11px] sm:text-xs">
            <motion.div
              className="no-scrollbar flex gap-6 whitespace-nowrap"
              animate={prefersReducedMotion ? undefined : controls}
              initial={false}
              onMouseEnter={() => controls.stop()}
              onMouseLeave={() => {
                if (!prefersReducedMotion) {
                  controls.start({
                    x: ['0%', '-50%'],
                    transition: { duration: 28, ease: 'linear', repeat: Infinity },
                  });
                }
              }}
              style={{ minWidth: '200%', willChange: 'transform' }}
            >
              {[...promoItems, ...promoItems].map((item, idx) => (
                <Link key={idx} to="#" className="mx-3 underline-offset-2 hover:underline">
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
            <Link to="/" className="font-serif text-xl tracking-widest text-gray-800 sm:text-2xl">
              FLOWER PLUS
            </Link>

            {/* Centered nav from API categories */}
            <nav className="hidden items-center justify-center gap-3 md:flex lg:gap-8">
              {processedCategories.map((cat: any) => (
                <div key={cat.id} className="group relative">
                  <button
                    type="button"
                    className="flex items-center whitespace-nowrap rounded-t-md px-2 py-1 text-[12px] font-medium text-[#7b8b8e] transition-colors hover:text-gray-900 sm:text-sm"
                  >
                    {cat.name}
                    {cat.children?.length > 0 && (
                      <ChevronDown className="ml-1 h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
                    )}
                  </button>

                  {cat.children?.length > 0 && (
                    <div className="invisible absolute left-0 top-full z-20 min-w-[240px] translate-y-2 rounded-md border border-gray-100 bg-white opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <ul className="py-2">
                        {cat.children.map((child: any) => (
                          <li key={child.id}>
                            <button
                              type="button"
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
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
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Heart className="h-4 w-4" />
              </Button>
              {infoUser === null || infoUser === undefined ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setOpenAuth(true)}
                  aria-label="Đăng nhập"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                </Button>
              ) : (
                 <DropdownMenu>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label="Giỏ hàng"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label="Đăng nhập"
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="text-gray-700">
                      Xin chào, {infoUser?.name || 'bạn'}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="w-full">
                        Hồ sơ
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="w-full">
                        Đơn hàng
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/support" className="w-full">
                        Hỗ trợ
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <p
                        className="w-full"
                        onClick={() => {
                          __helpers.cookie_delete('AT');
                          window.location.reload();
                        }}
                      >
                        Thoát
                      </p>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </div>

      <AuthModal open={openAuth} onOpenChange={setOpenAuth} />
    </div>
  );
}
