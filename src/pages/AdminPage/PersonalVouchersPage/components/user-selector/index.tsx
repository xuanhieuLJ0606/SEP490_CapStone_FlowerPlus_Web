import { useGetUsersForVoucher } from '@/queries/user.query';

interface User {
  id: number;
  userName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
}

interface UserSelectorProps {
  value?: number;
  onChange: (value: number) => void;
  placeholder?: string;
}

export default function UserSelector({
  value,
  onChange,
  placeholder = 'Chọn người dùng...'
}: UserSelectorProps) {
  const {
    data: usersResponse,
    isLoading,
    error
  } = useGetUsersForVoucher({
    page: 0,
    size: 100 // Get more users since we don't have search
  });

  // Ensure users is always an array
  const users = Array.isArray(usersResponse?.data) ? usersResponse.data : [];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    if (selectedValue) {
      onChange(Number(selectedValue));
    }
  };

  if (isLoading) {
    return (
      <select
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        disabled
      >
        <option>Đang tải danh sách người dùng...</option>
      </select>
    );
  }

  if (error) {
    return (
      <select
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        disabled
      >
        <option>Lỗi khi tải dữ liệu người dùng</option>
      </select>
    );
  }

  return (
    <select
      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      value={value || ''}
      onChange={handleChange}
    >
      <option value="">{placeholder}</option>
      {users.map((user: User) => (
        <option key={user.id} value={user.id}>
          {user.userName} ({user.email})
          {!user.isActive ? ' - Không hoạt động' : ''}
        </option>
      ))}
    </select>
  );
}
