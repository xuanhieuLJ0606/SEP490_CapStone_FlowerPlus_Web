import { useState } from 'react';
import { useCreateUser } from '@/queries/user.query';
import { useRouter } from '@/routes/hooks';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  UserPlus,
  Truck,
  Eye,
  EyeOff,
  Phone
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Add() {
  const { mutateAsync: createUser } = useCreateUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.userName.trim()) {
      newErrors.userName = 'Tên đăng nhập không được để trống';
    } else if (formData.userName.length < 3) {
      newErrors.userName = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Tên không được để trống';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Họ không được để trống';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại không được để trống';
    } else if (
      !/^(0|\+84)[0-9]{9,10}$/.test(formData.phone.replace(/\s/g, ''))
    ) {
      newErrors.phone =
        'Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const payload = {
      userName: formData.userName.trim(),
      password: formData.password,
      email: formData.email.trim(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      phone: formData.phone.trim(),
      role: 'DELIVERY_PERSON'
    };

    const [error] = await createUser(payload);

    setIsLoading(false);

    if (error) {
      toast({
        title: 'Thêm người giao hàng thất bại',
        description: error.message || 'Đã xảy ra lỗi khi thêm người giao hàng',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Thêm người giao hàng thành công',
      description: 'Người giao hàng đã được thêm vào hệ thống',
      variant: 'success'
    });

    router.back();
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-2 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-4xl font-bold text-transparent">
            Thêm người giao hàng
          </h1>
          <p className="text-gray-600">
            Tạo tài khoản mới cho nhân viên giao hàng
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="overflow-hidden rounded-3xl bg-white shadow-xl"
        >
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6">
            <div className="flex items-center gap-3 text-white">
              <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Thông tin người giao hàng</h2>
                <p className="text-sm text-pink-100">
                  Vui lòng điền đầy đủ thông tin bên dưới
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* Username */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <User className="h-4 w-4 text-pink-500" />
                  Tên đăng nhập
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  value={formData.userName}
                  onChange={(e) => handleChange('userName', e.target.value)}
                  className={`rounded-xl ${
                    errors.userName
                      ? 'border-red-500 focus:border-red-500'
                      : 'focus:border-pink-500'
                  }`}
                />
                {errors.userName && (
                  <p className="mt-1 text-sm text-red-500">{errors.userName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Mail className="h-4 w-4 text-pink-500" />
                  Email
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="Nhập địa chỉ email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`rounded-xl ${
                    errors.email
                      ? 'border-red-500 focus:border-red-500'
                      : 'focus:border-pink-500'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Phone className="h-4 w-4 text-pink-500" />
                  Số điện thoại
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="tel"
                  placeholder="Nhập số điện thoại (VD: 0912345678)"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={`rounded-xl ${
                    errors.phone
                      ? 'border-red-500 focus:border-red-500'
                      : 'focus:border-pink-500'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Lock className="h-4 w-4 text-pink-500" />
                  Mật khẩu
                  <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className={`rounded-xl pr-12 ${
                      errors.password
                        ? 'border-red-500 focus:border-red-500'
                        : 'focus:border-pink-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <Label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <User className="h-4 w-4 text-pink-500" />
                    Tên
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Nhập tên"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className={`rounded-xl ${
                      errors.firstName
                        ? 'border-red-500 focus:border-red-500'
                        : 'focus:border-pink-500'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <User className="h-4 w-4 text-pink-500" />
                    Họ
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Nhập họ"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className={`rounded-xl ${
                      errors.lastName
                        ? 'border-red-500 focus:border-red-500'
                        : 'focus:border-pink-500'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Role Badge */}
              <div className="rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 p-4">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-pink-600" />
                  <span className="font-semibold text-gray-700">Vai trò:</span>
                  <span className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-3 py-1 text-sm font-bold text-white">
                    Nhân viên giao hàng
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.back()}
                className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Hủy
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 font-semibold text-white shadow-lg shadow-pink-500/30 transition-all hover:shadow-xl hover:shadow-pink-500/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Đang thêm...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    <span>Thêm người giao hàng</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 rounded-2xl bg-white/60 p-6 backdrop-blur-lg"
        >
          <h3 className="mb-3 font-semibold text-gray-800">Lưu ý:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-pink-500"></span>
              <span>
                Tên đăng nhập phải có ít nhất 3 ký tự và không chứa khoảng trắng
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-pink-500"></span>
              <span>Mật khẩu phải có ít nhất 6 ký tự</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-pink-500"></span>
              <span>Email phải là địa chỉ email hợp lệ</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-pink-500"></span>
              <span>
                Số điện thoại phải bắt đầu bằng 0 hoặc +84 và có 10-11 số
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-pink-500"></span>
              <span>Tất cả các trường đều bắt buộc phải điền</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
