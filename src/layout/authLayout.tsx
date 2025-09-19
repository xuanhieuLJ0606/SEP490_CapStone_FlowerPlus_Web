import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-screen">
      <div className="grid grid-cols-1 lg:grid-cols-10 h-screen">
          {/* Left: Form slot */}
          <div className="bg-white p-8 lg:p-12 flex flex-col h-full lg:col-span-3 border-r border-gray-200">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-full bg-green-600 grid place-items-center text-white font-bold">F</div>
              <span className="font-semibold text-gray-900">FlowerPlus</span>
            </div>
            <div className="flex-1">
              <Outlet />
            </div>
            <div className="mt-10 text-xs text-gray-500">
              © {new Date().getFullYear()} FlowerPlus. All rights reserved.
            </div>
          </div>

          {/* Right: Visual panel */}
          <div className="relative overflow-hidden bg-gray-900 h-full lg:col-span-7">
            <img
              src="https://media.istockphoto.com/id/603859820/photo/flower-shop.jpg?s=612x612&w=0&k=20&c=t_cKbIYz8pISz1rSQlvG5BWwYSCtkvRNw5ugzkwM3Xo="
              alt="Blooming flowers"
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
            {/* Frosted band */}
            <div className="absolute left-1/2 -translate-x-1/2 top-24 w-[85%] h-28 backdrop-blur-[6px] bg-white/10 rounded-xl border border-white/20"></div>
            {/* Quote */}
            <div className="relative z-10 p-8 lg:p-12 mt-40 text-white">
              <h3 className="text-2xl lg:text-3xl font-semibold leading-snug">
                Chúng tôi giao hoa nhanh và luôn đúng cảm xúc của bạn.
                Khi người khác bận rộn, chúng tôi vẫn ra mắt những bó hoa mới.
              </h3>
              <div className="mt-8">
                <p className="font-semibold">Sophie Hall</p>
                <p className="text-white/80 text-sm">Khách hàng thân thiết</p>
              </div>
              <div className="mt-6 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>
            {/* Arrows */}
            <div className="absolute bottom-6 right-6 flex items-center gap-3">
              <button className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-white grid place-items-center transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-white grid place-items-center transition-colors">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            {/* Brand watermark */}
            <Link to="/" className="absolute top-6 left-6 inline-flex items-center gap-2 text-white/90">
              <div className="w-8 h-8 rounded-full bg-white/20 grid place-items-center font-bold">F</div>
              <span className="font-semibold">FlowerPlus</span>
            </Link>
          </div>
        </div>
    </div>
  );
};

export default AuthLayout;


