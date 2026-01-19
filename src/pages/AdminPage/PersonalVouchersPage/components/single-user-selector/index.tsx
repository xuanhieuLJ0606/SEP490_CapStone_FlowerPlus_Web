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

interface SingleUserSelectorProps {
  value?: number;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
}

export default function SingleUserSelector({
  value,
  onChange,
  placeholder = 'Chọn người dùng...'
}: SingleUserSelectorProps) {
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

  const handleUserSelect = (userId: number) => {
    if (value === userId) {
      // Deselect if clicking the same user
      onChange(undefined);
    } else {
      onChange(userId);
    }
  };

  const handleClear = () => {
    onChange(undefined);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
          Đang tải danh sách người dùng...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <div className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-red-500">
          Lỗi khi tải dữ liệu người dùng
        </div>
      </div>
    );
  }

  const selectedUser = users.find((u: User) => u.id === value);

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

      {/* Clear selection button */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="rounded-md bg-gray-50 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
        >
          Bỏ chọn
        </button>
      )}

      {/* Radio button list */}
      <div className="max-h-64 overflow-y-auto rounded-md border border-input bg-background">
        {filteredUsers.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            {searchTerm
              ? 'Không tìm thấy người dùng nào'
              : 'Không có người dùng'}
          </div>
        ) : (
          <div className="divide-y">
            {filteredUsers.map((user: User) => {
              const isSelected = value === user.id;
              return (
                <label
                  key={user.id}
                  className={`flex cursor-pointer items-center gap-3 p-3 hover:bg-gray-50 ${
                    !user.isActive ? 'opacity-60' : ''
                  } ${isSelected ? 'bg-blue-50' : ''}`}
                >
                  <input
                    type="radio"
                    name="selectedUser"
                    checked={isSelected}
                    onChange={() => handleUserSelect(user.id)}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
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
                      {isSelected && (
                        <span className="rounded bg-blue-100 px-1 text-xs text-blue-600">
                          Đã chọn
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
              );
            })}
          </div>
        )}
      </div>

      {/* Search results info */}
      <div className="text-sm text-gray-600">
        <span>
          {searchTerm
            ? `Hiển thị: ${filteredUsers.length} / ${users.length}`
            : `Tổng: ${users.length} người dùng`}
        </span>
      </div>

      {/* Selected user preview */}
      {selectedUser && (
        <div className="rounded-md border bg-blue-50 p-3">
          <div className="mb-1 text-xs font-medium text-blue-700">
            Người dùng đã chọn:
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-blue-900">
                {selectedUser.userName}
              </div>
              <div className="text-sm text-blue-700">{selectedUser.email}</div>
              {(selectedUser.firstName || selectedUser.lastName) && (
                <div className="text-xs text-blue-600">
                  {[selectedUser.firstName, selectedUser.lastName]
                    .filter(Boolean)
                    .join(' ')}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="text-blue-500 hover:text-blue-700"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
