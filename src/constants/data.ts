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

export const ceoNavItems: any = [
  {
    label: 'Quản lý',
    detail: [
      {
        title: 'Tổng quan',
        url: '/dashboard',
        icon: 'dashboard',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      }
    ]
  },
  {
    label: 'Danh mục',
    detail: [
      {
        title: 'Danh sách danh mục',
        url: '/admin/categories',
        icon: 'grid',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      }
    ]
  }
];

export const managerNavItems: any = [
  {
    label: 'Quản lý Nhập/Xuất',
    detail: [
      {
        title: 'Danh sách lô nhập',
        url: '/lo-nhap',
        icon: 'download',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      }
    ]
  },
  {
    label: 'Thuốc/Vaccine',
    detail: [
      {
        title: 'Danh sách thuốc/vaccine',
        url: '/danh-sach-thuoc',
        icon: 'syringe',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      }
    ]
  }
];

export const employeeNavItems: any = [
  {
    label: 'Vật nuôi',
    detail: [
      {
        title: 'Danh sách vật nuôi',
        url: '/danh-sach-vat-nuoi',
        icon: 'dog',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      }
    ]
  },
  {
    label: 'Bệnh dịch',
    detail: [
      {
        title: 'Danh sách các loại bệnh',
        url: '/danh-sach-benh',
        icon: 'pill',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      }
    ]
  }
];

export const AssistantNavItems: any = [
  {
    label: 'Vật nuôi',
    detail: [
      {
        title: 'Danh sách vật nuôi',
        url: '/danh-sach-vat-nuoi',
        icon: 'dog',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      }
    ]
  },
  {
    label: 'Bệnh dịch',
    detail: [
      {
        title: 'Danh sách các loại bệnh',
        url: '/danh-sach-benh',
        icon: 'pill',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      }
    ]
  }
];

export const Permission = {
  1: 'Users.View',
  2: 'Permission.Users.Create'
};

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