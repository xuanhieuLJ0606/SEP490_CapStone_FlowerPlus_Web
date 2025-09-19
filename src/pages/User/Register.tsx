import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <motion.div initial={{opacity:0, y:16}} animate={{opacity:1, y:0}} transition={{duration:0.4}}>
      <div className="max-w-xl">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create your account</h1>
        <p className="text-gray-600 mt-2">Tham gia FlowerPlus để đặt hoa nhanh chóng.</p>
      </div>

      <div className="mt-6">
        <button className="btn btn-outline btn-lg w-full border-2 text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-green-500">
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

      <div className="p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm bg-white max-w-xl">
      <form className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-800">Họ</label>
          <input className="mt-1 input input-bordered input-lg w-full bg-white text-gray-900 placeholder:text-gray-500 border border-black" placeholder="Nguyễn" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-800">Tên</label>
          <input className="mt-1 input input-bordered input-lg w-full bg-white text-gray-900 placeholder:text-gray-500 border border-black" placeholder="An" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-800">Email</label>
          <input type="email" className="mt-1 input input-bordered input-lg w-full bg-white text-gray-900 placeholder:text-gray-500 border border-black focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="you@example.com" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-800">Mật khẩu</label>
          <div className="relative mt-1">
            <input
              type={showPassword ? 'text' : 'password'}
              className="input input-bordered input-lg w-full bg-white text-gray-900 placeholder:text-gray-500 border border-black pr-12 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="••••••••"
            />
            <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800">
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input id="terms" type="checkbox" className="checkbox checkbox-success" />
          <label htmlFor="terms" className="text-sm text-gray-700">Tôi đồng ý với điều khoản sử dụng</label>
        </div>
        <motion.button whileTap={{scale:0.98}} type="submit" className="btn btn-primary btn-lg w-full">Tạo tài khoản</motion.button>
      </form>
      </div>

      <p className="mt-6 text-sm text-gray-600">
        Đã có tài khoản? <Link to="/auth/login" className="text-green-600 font-medium hover:underline">Đăng nhập</Link>
      </p>
    </motion.div>
  );
};

export default Register;


