export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export const shopOwnerNavItems: any = [
  {
    label: 'Quản lý',
    detail: [
      {
        title: 'Tổng quan',
        url: '/admin/dashboard',
        icon: 'dashboard',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      }
    ]
  },
  {
    label: 'Người dùng',
    detail: [
      {
        title: 'Quản lý người dùng',
        url: '/admin/user-management',
        icon: 'users',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      }
    ]
  },
  {
    label: 'Bán hàng',
    detail: [
      {
        title: 'Giao dịch',
        url: '/admin/payment',
        icon: 'banknote',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      },
      {
        title: 'Đơn hàng',
        url: '/admin/orders',
        icon: 'orders',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      },
      {
        title: 'Hoàn tiền',
        url: '/admin/refunds',
        icon: 'banknote',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      }
    ]
  },
  {
    label: 'Tài nguyên',
    detail: [
      {
        title: 'Danh mục',
        url: '/admin/categories',
        icon: 'grid',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      },
      {
        title: 'Sản phẩm',
        url: '/admin/products',
        icon: 'flower',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      },
      {
        title: 'Mã giảm giá',
        url: '/admin/vouchers',
        icon: 'voucher',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      }
    ]
  }
];

export const sumaryUser = {
  CEO: 5,
  Manager: 3,
  Employee: 10
};

export const InspectionCodeRangeStatus: any = {
  1: 'Dùng hết',
  2: 'Đang sử dụng',
  3: 'Mới'
};

export const PRODUCT_TYPE = {
  FLOWER: 'FLOWER',
  ITEM: 'ITEM',
  PRODUCT: 'PRODUCT'
};

export const PRODUCT_TYPE_MEAN = {
  FLOWER: 'Hoa',
  ITEM: 'Phụ kiện',
  PRODUCT: 'Sản phẩm'
};
