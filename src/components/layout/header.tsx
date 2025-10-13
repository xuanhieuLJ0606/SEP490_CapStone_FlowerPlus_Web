import { Clock, ShoppingCart, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categories = [
  {
    label: 'Hoa Sinh Nhật',
    children: [
      'Hoa Hồng Sinh Nhật',
      'Hoa Ly Sinh Nhật',
      'Hoa Cẩm Chướng Sinh Nhật'
    ]
  },
  {
    label: 'Hoa Khai Trương',
    children: [
      'Kệ Hoa Khai Trương',
      'Lẵng Hoa Khai Trương',
      'Giỏ Hoa Khai Trương',
      'Kệ Hoa Mini Khai Trương'
    ]
  },
  {
    label: 'Hoa Tốt Nghiệp',
    children: ['Bó Hoa Tốt Nghiệp', 'Hoa Gấu Bông Tốt Nghiệp']
  },
  {
    label: 'Hoa Bó',
    children: ['Bó Hoa Hồng', 'Bó Hoa Cúc', 'Bó Hoa Mẫu Đơn']
  },
  { label: 'Bó Hoa Hồng', children: ['Hồng Đỏ', 'Hồng Trắng', 'Hồng Vàng'] },
  {
    label: 'Hộp Hoa Mica',
    children: ['Hộp Hoa Mica Đỏ', 'Hộp Hoa Mica Hồng', 'Hộp Hoa Mica Mix']
  }
];

export default function Header() {
  return (
    <div className="w-full bg-white">
      {/* Top Bar */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-2">
          <div className="flex flex-col items-center justify-between space-y-4 lg:flex-row lg:space-y-0">
            <div className="flex w-full flex-col items-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 lg:w-auto">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="mr-1 h-4 w-4" />
                <span>7:30 - 22:00</span>
              </div>
            </div>

            <div className="order-first text-center lg:order-none">
              <h1 className="text-xl font-bold text-green-800 sm:text-2xl">
                Hoa cao cấp
              </h1>
              <p className="text-xs text-gray-600 sm:text-sm">
                Một bó hoa đẹp sẽ mang lại một trải nghiệm đáng nhớ.
              </p>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-4">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-green-200 hover:bg-green-50 lg:h-10 lg:w-10"
              >
                <ShoppingCart className="h-4 w-4 text-green-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <nav className="relative flex items-center justify-center space-x-2 py-3 sm:space-x-4 lg:space-x-8">
            {categories.map((cat) => (
              <div key={cat.label} className="group relative">
                <button
                  type="button"
                  className="flex items-center whitespace-nowrap rounded-t-md px-3 py-1 text-xs font-medium text-[#7b8b8e] transition-colors group-hover:bg-[#b6c09c]
                             group-hover:text-white sm:text-sm"
                >
                  {cat.label}
                  <ChevronDown className="ml-1 h-3 w-3 transition-transform duration-200 group-hover:rotate-180 group-hover:text-white" />
                </button>

                <div
                  className="invisible absolute left-0 top-full z-20 min-w-[260px] translate-y-2 rounded-md border border-gray-100
                             bg-white opacity-0 shadow-lg transition-all duration-150
                             hover:visible hover:translate-y-0 hover:opacity-100
                             group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
                >
                  <ul className="space-y-2">
                    {cat.children?.map((child) => (
                      <li key={child}>
                        <button
                          type="button"
                          className="hover:bg-green w-full px-5 py-1 text-left text-base font-normal text-[#222] transition-colors hover:text-white"
                        >
                          {child}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
