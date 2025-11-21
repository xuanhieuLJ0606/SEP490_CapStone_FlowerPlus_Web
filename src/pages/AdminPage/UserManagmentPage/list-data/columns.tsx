import { ColumnDef } from '@tanstack/react-table';
import __helpers from '@/helpers';
import { useSearchParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'STT',
    header: 'STT',
    enableSorting: true,
    cell: ({ row }) => {
      const [searchParams] = useSearchParams();
      const pageLimit = Number(searchParams.get('limit') || 10);
      const page = Number(searchParams.get('page') || 1);
      const rowIndex = row.index;
      const serialNumber = (page - 1) * pageLimit + rowIndex + 1;
      return <span className="font-medium">{serialNumber}</span>;
    }
  },
  {
    accessorKey: 'avatar',
    header: 'Avatar',
    enableSorting: false,
    cell: ({ row }) => {
      const firstName = row.original.firstName || '';
      const lastName = row.original.lastName || '';
      const initials =
        `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

      return (
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={row.original.avatar}
            alt={`${firstName} ${lastName}`}
          />
          <AvatarFallback className="bg-gradient-to-br from-pink-100 to-purple-100 font-semibold text-pink-600">
            {initials}
          </AvatarFallback>
        </Avatar>
      );
    }
  },
  {
    accessorKey: 'userName',
    header: 'Tên đăng nhập',
    enableSorting: true,
    cell: ({ row }) => {
      return (
        <span className="font-medium text-gray-900">
          {row.original.userName}
        </span>
      );
    }
  },
  {
    accessorKey: 'fullName',
    header: 'Họ và tên',
    enableSorting: true,
    cell: ({ row }) => {
      const fullName =
        `${row.original.firstName || ''} ${row.original.lastName || ''}`.trim();
      return <span className="font-medium">{fullName || 'Chưa cập nhật'}</span>;
    }
  },
  {
    accessorKey: 'email',
    header: 'Email',
    enableSorting: true,
    cell: ({ row }) => {
      return (
        <span className="text-sm text-gray-600">
          {row.original.email || 'Chưa có email'}
        </span>
      );
    }
  },
  {
    accessorKey: 'phone',
    header: 'Số điện thoại',
    enableSorting: false,
    cell: ({ row }) => {
      return (
        <span className="text-sm text-gray-600">
          {row.original.phone || 'Chưa có SĐT'}
        </span>
      );
    }
  },
  {
    accessorKey: 'gender',
    header: 'Giới tính',
    enableSorting: true,
    cell: ({ row }) => {
      const gender = row.original.gender;
      const genderMap: { [key: string]: { label: string; color: string } } = {
        MALE: { label: 'Nam', color: 'bg-blue-100 text-blue-700' },
        FEMALE: { label: 'Nữ', color: 'bg-pink-100 text-pink-700' },
        OTHER: { label: 'Khác', color: 'bg-gray-100 text-gray-700' }
      };

      const genderInfo = genderMap[gender] || {
        label: 'Chưa xác định',
        color: 'bg-gray-100 text-gray-700'
      };

      return (
        <Badge className={`${genderInfo.color} border-0`}>
          {genderInfo.label}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'birthDate',
    header: 'Ngày sinh',
    enableSorting: true,
    cell: ({ row }) => {
      const birthDate = row.original.birthDate;
      if (!birthDate)
        return <span className="text-sm text-gray-500">Chưa cập nhật</span>;

      return (
        <span className="text-sm text-gray-600">
          {__helpers.convertToDate(birthDate)}
        </span>
      );
    }
  },
  {
    accessorKey: 'role',
    header: 'Vai trò',
    enableSorting: true,
    cell: ({ row }) => {
      const role = row.original.role;
      const roleMap: { [key: string]: { label: string; color: string } } = {
        SHOP_OWNER: {
          label: 'Chủ cửa hàng',
          color: 'bg-blue-500'
        },
        ADMIN: {
          label: 'Quản trị viên',
          color: 'bg-purple-500'
        },
        USER: {
          label: 'Người dùng',
          color: 'bg-yellow-500'
        },
        DELIVERY_PERSON: {
          label: 'Người giao hàng',
          color: 'bg-orange-500'
        }
      };

      const roleInfo = roleMap[role] || {
        label: role,
        color: 'bg-gray-500 text-white'
      };

      return (
        <Badge className={`${roleInfo.color} border-0 font-semibold`}>
          {roleInfo.label}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'isActive',
    header: 'Trạng thái',
    enableSorting: true,
    cell: ({ row }) => {
      const isActive = row.original.isActive;

      return (
        <Badge
          className={`${
            isActive
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
              : 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
          } border-0 font-semibold`}
        >
          {isActive ? 'Hoạt động' : 'Không hoạt động'}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Ngày tạo',
    enableSorting: true,
    cell: ({ row }) => {
      return (
        <span className="text-sm text-gray-600">
          {__helpers.convertToDate(row.original.createdAt)}
        </span>
      );
    }
  },
  {
    accessorKey: 'updatedAt',
    header: 'Ngày cập nhật',
    enableSorting: true,
    cell: ({ row }) => {
      return (
        <span className="text-sm text-gray-600">
          {__helpers.convertToDate(row.original.updatedAt)}
        </span>
      );
    }
  }
  // {
  //   id: 'actions',
  //   header: 'Hành động',
  //   cell: ({ row }) => <CellAction data={row.original} />
  // }
];
