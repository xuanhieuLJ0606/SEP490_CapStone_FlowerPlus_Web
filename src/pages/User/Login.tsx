import React from 'react';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back</h1>
      <p className="text-gray-600 mt-2">Vui lòng đăng nhập để tiếp tục.</p>

      <div className="mt-8">
        <button className="w-full border border-gray-300 rounded-lg py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
          <span className="inline-flex items-center justify-center gap-2">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
            Đăng nhập với Google
          </span>
        </button>
      </div>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px bg-gray-200 flex-1" />
        <span className="text-xs uppercase text-gray-400">hoặc</span>
        <div className="h-px bg-gray-200 flex-1" />
      </div>

      <form className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input type="email" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="you@example.com" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
            <Link to="#" className="text-sm text-green-600 hover:underline">Quên mật khẩu?</Link>
          </div>
          <input type="password" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="••••••••" />
        </div>
        <div className="flex items-center gap-2">
          <input id="remember" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
          <label htmlFor="remember" className="text-sm text-gray-700">Ghi nhớ trong 30 ngày</label>
        </div>
        <button type="submit" className="w-full bg-gray-900 text-white rounded-lg py-2.5 hover:bg-black transition-colors">Đăng nhập</button>
      </form>

      <p className="mt-6 text-sm text-gray-600">
        Chưa có tài khoản? <Link to="/auth/register" className="text-green-600 font-medium hover:underline">Đăng ký miễn phí</Link>
      </p>
    </div>
  );
};

export default Login;


