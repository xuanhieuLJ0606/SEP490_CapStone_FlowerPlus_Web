import { TrendingUp, ShoppingCart, Users, Flower2 } from 'lucide-react';

export function StatCards() {
  const stats = [
    {
      title: 'Doanh thu hôm nay',
      value: '12.500.000 ₫',
      change: '+12.5%',
      icon: TrendingUp,
      color: 'from-rose-400 to-pink-600'
    },
    {
      title: 'Đơn hàng',
      value: '248',
      change: '+8.2%',
      icon: ShoppingCart,
      color: 'from-amber-400 to-orange-600'
    },
    {
      title: 'Khách hàng mới',
      value: '42',
      change: '+5.1%',
      icon: Users,
      color: 'from-emerald-400 to-teal-600'
    },
    {
      title: 'Sản phẩm bán hàng',
      value: '1,247',
      change: '+3.4%',
      icon: Flower2,
      color: 'from-purple-400 to-indigo-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="rounded-xl border border-slate-100 bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {stat.title}
              </h3>
              <div className={`bg-gradient-to-br p-3 ${stat.color} rounded-lg`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {stat.value}
              </span>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {stat.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
