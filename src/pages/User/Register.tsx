import React from 'react';
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create your account</h1>
      <p className="text-gray-600 mt-2">Tham gia FlowerPlus để đặt hoa nhanh chóng.</p>

      <div className="mt-8">
        <button className="w-full border border-gray-300 rounded-lg py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
          <span className="inline-flex items-center justify-center gap-2">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
            Đăng ký với Google
          </span>
        </button>
      </div>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px bg-gray-200 flex-1" />
        <span className="text-xs uppercase text-gray-400">hoặc</span>
        <div className="h-px bg-gray-200 flex-1" />
      </div>

      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Họ</label>
            <input className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Nguyễn" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Tên</label>
            <input className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="An" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input type="email" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="you@example.com" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
          <input type="password" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="••••••••" />
        </div>
        <div className="flex items-center gap-2">
          <input id="terms" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
          <label htmlFor="terms" className="text-sm text-gray-700">Tôi đồng ý với điều khoản sử dụng</label>
        </div>
        <button type="submit" className="w-full bg-green-600 text-white rounded-lg py-2.5 hover:bg-green-700 transition-colors">Tạo tài khoản</button>
      </form>

      <p className="mt-6 text-sm text-gray-600">
        Đã có tài khoản? <Link to="/auth/login" className="text-green-600 font-medium hover:underline">Đăng nhập</Link>
      </p>
    </div>
  );
};

export default Register;


