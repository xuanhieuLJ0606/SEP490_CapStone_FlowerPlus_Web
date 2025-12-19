import { useState, useEffect } from 'react';
import {
  User,
  Edit2,
  Camera,
  Lock,
  Trash2,
  LogOut,
  Mail,
  Phone,
  Calendar,
  UserCircle
} from 'lucide-react';
import { useUpdateProfile } from '@/queries/auth.query';
import { toast } from 'sonner';
export const PersonalInfo = ({
  userData,
  isPending
}: {
  userData: any;
  isPending: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    birthDate: userData?.birthDate || '',
    gender: userData?.gender || 'MALE'
  });

  const updateProfileMutation = useUpdateProfile();

  // Cập nhật formData khi userData thay đổi
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        birthDate: formatDateForInput(userData.birthDate) || '',
        gender: userData.gender || 'MALE'
      });
    }
  }, [userData]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const formatDateTimeForBackend = (dateString) => {
    if (!dateString) return null;
    // Input date format: YYYY-MM-DD -> LocalDateTime format: YYYY-MM-DDTHH:mm:ss
    return dateString + 'T00:00:00';
  };

  const getRoleLabel = (role) => {
    const roles = {
      ADMIN: 'Quản trị viên',
      SHOP_OWNER: 'Chủ cửa hàng',
      USER: 'Người dùng',
      CUSTOMER: 'Khách hàng'
    };
    return roles[role] || role;
  };

  const getGenderLabel = (gender) => {
    const genders = {
      MALE: 'Nam',
      FEMALE: 'Nữ',
      OTHER: 'Khác'
    };
    return genders[gender] || gender;
  };

  const handleSave = async () => {
    try {
      const dataToSend = {
        ...formData,
        birthDate: formatDateTimeForBackend(formData.birthDate)
      };
      await updateProfileMutation.mutateAsync(dataToSend);
      toast.success('Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin'
      );
    }
  };

  const handleCancel = () => {
    // Reset form về dữ liệu gốc
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        birthDate: formatDateForInput(userData.birthDate) || '',
        gender: userData.gender || 'MALE'
      });
    }
    setIsEditing(false);
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white transition-all hover:bg-rose-700"
          >
            <Edit2 className="h-4 w-4" />
            Chỉnh sửa
          </button>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* User Status and Role */}
        <div className="mb-6 flex flex-wrap gap-3">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${
              userData?.active
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            <div
              className={`h-2 w-2 rounded-full ${userData?.active ? 'bg-emerald-500' : 'bg-red-500'}`}
            ></div>
            {userData?.active ? 'Hoạt động' : 'Không hoạt động'}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-1.5 text-sm font-semibold text-rose-700">
            <UserCircle className="h-4 w-4" />
            {getRoleLabel(userData?.role)}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <User className="h-4 w-4 text-rose-600" />
              Họ
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            ) : (
              <p className="text-base text-gray-900">{userData?.firstName}</p>
            )}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <User className="h-4 w-4 text-rose-600" />
              Tên
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            ) : (
              <p className="text-base text-gray-900">{userData?.lastName}</p>
            )}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <User className="h-4 w-4 text-rose-600" />
              Tên đăng nhập
            </label>
            <p className="text-base text-gray-900">{userData?.userName}</p>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Calendar className="h-4 w-4 text-rose-600" />
              Ngày sinh
            </label>
            {isEditing ? (
              <input
                type="date"
                value={formatDateForInput(formData.birthDate)}
                onChange={(e) =>
                  setFormData({ ...formData, birthDate: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            ) : (
              <p className="text-base text-gray-900">
                {formatDate(userData?.birthDate)}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Phone className="h-4 w-4 text-rose-600" />
              Số điện thoại
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                placeholder="Nhập số điện thoại"
              />
            ) : (
              <p className="text-base text-gray-900">
                {userData?.phone || 'Chưa cập nhật'}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Mail className="h-4 w-4 text-rose-600" />
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            ) : (
              <p className="text-base text-gray-900">{userData?.email}</p>
            )}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <User className="h-4 w-4 text-rose-600" />
              Giới tính
            </label>
            {isEditing ? (
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            ) : (
              <p className="text-base text-gray-900">
                {getGenderLabel(userData?.gender)}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Calendar className="h-4 w-4 text-rose-600" />
              Ngày tạo tài khoản
            </label>
            <p className="text-base text-gray-900">
              {formatDate(userData?.createdAt)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={updateProfileMutation.isPending}
                className="rounded-lg bg-rose-600 px-6 py-2.5 font-semibold text-white transition-all hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updateProfileMutation.isPending
                  ? 'Đang lưu...'
                  : 'Lưu thay đổi'}
              </button>
              <button
                onClick={handleCancel}
                disabled={updateProfileMutation.isPending}
                className="rounded-lg border-2 border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Hủy
              </button>
            </>
          ) : (
            <>
              <button className="flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 transition-all hover:border-rose-600 hover:bg-rose-50 hover:text-rose-600">
                <Camera className="h-4 w-4" />
                Đổi ảnh đại diện
              </button>
              <button className="flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 transition-all hover:border-rose-600 hover:bg-rose-50 hover:text-rose-600">
                <Lock className="h-4 w-4" />
                Đổi mật khẩu
              </button>
              <button className="flex items-center gap-2 rounded-lg border-2 border-red-300 bg-white px-6 py-2.5 font-semibold text-red-600 transition-all hover:border-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
                Xóa tài khoản
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-2.5 font-semibold text-white transition-all hover:bg-gray-800">
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
