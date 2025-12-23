import { useState, useEffect } from 'react';
import {
  User,
  Edit2,
  Camera,
  Lock,
  LogOut,
  Mail,
  Phone,
  Calendar,
  UserCircle
} from 'lucide-react';
import { useUpdateProfile, useChangePassword } from '@/queries/auth.query';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/auth.slice';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UploadImage from '@/components/shared/upload-image';
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

  const dispatch = useDispatch();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  // States for modals
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

  const handleAvatarChange = async () => {
    if (!avatarUrl) {
      toast.error('Vui lòng chọn ảnh đại diện');
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        avatar: avatarUrl,
        birthDate: formatDateTimeForBackend(formData.birthDate)
      };
      await updateProfileMutation.mutateAsync(dataToSend);
      toast.success('Cập nhật ảnh đại diện thành công!');
      setIsAvatarModalOpen(false);
      setAvatarUrl('');
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          'Có lỗi xảy ra khi cập nhật ảnh đại diện'
      );
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword.trim()) {
      toast.error('Vui lòng nhập mật khẩu cũ');
      return;
    }
    if (!newPassword.trim()) {
      toast.error('Vui lòng nhập mật khẩu mới');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        oldPassword,
        newPassword,
        confirmNewPassword: confirmPassword
      });
      toast.success('Đổi mật khẩu thành công!');
      setIsPasswordModalOpen(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu'
      );
    }
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogout = () => {
    dispatch(logout());
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
              <button
                onClick={() => setIsAvatarModalOpen(true)}
                className="flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 transition-all hover:border-rose-600 hover:bg-rose-50 hover:text-rose-600"
              >
                <Camera className="h-4 w-4" />
                Đổi ảnh đại diện
              </button>
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 transition-all hover:border-rose-600 hover:bg-rose-50 hover:text-rose-600"
              >
                <Lock className="h-4 w-4" />
                Đổi mật khẩu
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-2.5 font-semibold text-white transition-all hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>

      {/* Avatar Change Modal */}
      <Dialog open={isAvatarModalOpen} onOpenChange={setIsAvatarModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Đổi ảnh đại diện</DialogTitle>
            <DialogDescription>
              Chọn ảnh đại diện mới cho tài khoản của bạn
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <UploadImage
              multiple={false}
              endpoint={
                process.env.NODE_ENV === 'production'
                  ? 'https://flower.autopass.blog/api/files/upload'
                  : 'http://localhost:8081/api/files/upload'
              }
              onChange={(url) => setAvatarUrl(url as string)}
              maxFiles={1}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAvatarModalOpen(false);
                setAvatarUrl('');
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleAvatarChange}
              disabled={updateProfileMutation.isPending || !avatarUrl}
            >
              {updateProfileMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Change Modal */}
      <Dialog
        open={isPasswordModalOpen}
        onOpenChange={handleClosePasswordModal}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Đổi mật khẩu</DialogTitle>
            <DialogDescription>
              Nhập mật khẩu cũ và mật khẩu mới để đổi mật khẩu
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
              <Input
                id="oldPassword"
                type="password"
                placeholder="Nhập mật khẩu cũ"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Xác nhận mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClosePasswordModal}>
              Hủy
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending
                ? 'Đang xử lý...'
                : 'Đổi mật khẩu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
