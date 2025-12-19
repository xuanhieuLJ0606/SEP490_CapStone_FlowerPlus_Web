import { useState, useMemo } from 'react';
import { useGetUsersForVoucher } from '@/queries/user.query';

interface User {
  id: number;
  userName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
}

interface MultiUserSelectorProps {
  value: number[];
  onChange: (value: number[]) => void;
  placeholder?: string;
}

export default function MultiUserSelector({
  value,
  onChange,
  placeholder = 'Chọn nhiều người dùng...'
}: MultiUserSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Load all users once without search filter
  const {
    data: usersResponse,
    isLoading,
    error
  } = useGetUsersForVoucher({
    page: 0,
    size: 500 // Get all users at once for client-side filtering
  });

  // Ensure users is always an array
  const users = Array.isArray(usersResponse?.data) ? usersResponse.data : [];

  // Client-side filtering - instant results, no API calls
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;

    const term = searchTerm.toLowerCase();
    return users.filter((user: User) => {
      // Safe string comparison with null checks
      const userName = user.userName?.toLowerCase() || '';
      const email = user.email?.toLowerCase() || '';
      const firstName = user.firstName?.toLowerCase() || '';
      const lastName = user.lastName?.toLowerCase() || '';

      return (
        userName.includes(term) ||
        email.includes(term) ||
        firstName.includes(term) ||
        lastName.includes(term)
      );
    });
  }, [users, searchTerm]);

  const handleUserToggle = (userId: number) => {
    if (value.includes(userId)) {
      onChange(value.filter((id) => id !== userId));
    } else {
      onChange([...value, userId]);
    }
  };

  const handleSelectAll = () => {
    const activeUserIds = filteredUsers
      .filter((user: User) => user.isActive)
      .map((user: User) => user.id);
    onChange([...new Set([...value, ...activeUserIds])]);
  };

  const handleSelectAllFiltered = () => {
    const filteredUserIds = filteredUsers.map((user: User) => user.id);
    onChange([...new Set([...value, ...filteredUserIds])]);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <select
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          disabled
          size={5}
        >
          <option>Đang tải danh sách người dùng...</option>
        </select>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <select
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          disabled
          size={5}
        >
          <option>Lỗi khi tải dữ liệu người dùng</option>
        </select>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Search input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        />
        {/* Clear button */}
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>

      {/* Control buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSelectAll}
          className="rounded-md bg-blue-50 px-3 py-1 text-sm text-blue-600 hover:bg-blue-100"
        >
          Chọn tất cả hoạt động ({users.filter((u: User) => u.isActive).length})
        </button>
        {searchTerm && filteredUsers.length > 0 && (
          <button
            type="button"
            onClick={handleSelectAllFiltered}
            className="rounded-md bg-green-50 px-3 py-1 text-sm text-green-600 hover:bg-green-100"
          >
            Chọn kết quả tìm kiếm ({filteredUsers.length})
          </button>
        )}
        <button
          type="button"
          onClick={handleClearAll}
          className="rounded-md bg-gray-50 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
        >
          Bỏ chọn tất cả
        </button>
      </div>

      {/* Checkbox list */}
      <div className="max-h-64 overflow-y-auto rounded-md border border-input bg-background">
        {filteredUsers.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            {searchTerm
              ? 'Không tìm thấy người dùng nào'
              : 'Không có người dùng'}
          </div>
        ) : (
          <div className="divide-y">
            {filteredUsers.map((user: User) => (
              <label
                key={user.id}
                className={`flex cursor-pointer items-center gap-3 p-3 hover:bg-gray-50 ${
                  !user.isActive ? 'opacity-60' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={value.includes(user.id)}
                  onChange={() => handleUserToggle(user.id)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`truncate font-medium ${!user.isActive ? 'text-gray-400' : ''}`}
                    >
                      {user.userName}
                    </span>
                    {!user.isActive && (
                      <span className="rounded bg-red-100 px-1 text-xs text-red-600">
                        Không hoạt động
                      </span>
                    )}
                  </div>
                  <div
                    className={`truncate text-sm ${!user.isActive ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    {user.email}
                  </div>
                  {(user.firstName || user.lastName) && (
                    <div className="truncate text-xs text-gray-400">
                      {[user.firstName, user.lastName]
                        .filter(Boolean)
                        .join(' ')}
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Search results info */}
      <div className="flex justify-between text-sm text-gray-600">
        <span>
          {searchTerm
            ? `Hiển thị: ${filteredUsers.length} / ${users.length}`
            : `Tổng: ${users.length} người dùng`}
        </span>
        <span>Đã chọn: {value.length}</span>
      </div>

      {/* Selected users preview */}
      {value.length > 0 && (
        <div className="max-h-32 overflow-y-auto rounded-md border bg-gray-50 p-2">
          <div className="mb-1 text-xs font-medium text-gray-700">
            Người dùng đã chọn:
          </div>
          <div className="space-y-1">
            {value.map((userId) => {
              const user = users.find((u: User) => u.id === userId);
              return user ? (
                <div
                  key={userId}
                  className="flex items-center justify-between text-xs"
                >
                  <span>
                    {user.userName} ({user.email})
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onChange(value.filter((id) => id !== userId))
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
