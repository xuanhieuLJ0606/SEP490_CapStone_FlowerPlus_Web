import { useState, useMemo } from 'react';
import { User, Package, MapPin, Tag, Banknote } from 'lucide-react';
import { usePathname } from '@/routes/hooks';
import OrderHistoryProfile from './Order';
import { PersonalInfo } from './PersonalInfo';
import { useGetMyInfo } from '@/queries/auth.query';
import Address from './Address';
import RefundRequests from './RefundRequests';
import PersonalVouchers from './PersonalVouchers';

const PlaceholderContent = ({ title }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
      <p className="text-gray-500">Nội dung {title} sẽ hiển thị ở đây</p>
    </div>
  </div>
);

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('info');
  const { data: resUser, isPending } = useGetMyInfo();
  const userData = resUser;
  const pathname = usePathname();

  // Kiểm tra nếu là admin profile (route /admin/profile)
  const isAdminProfile = pathname?.includes('/admin/profile');

  // Menu items - chỉ hiển thị thông tin cá nhân cho admin
  const menuItems = useMemo(() => {
    if (isAdminProfile) {
      return [{ id: 'info', label: 'Thông tin cá nhân', icon: User }];
    }
    return [
      { id: 'info', label: 'Thông tin cá nhân', icon: User },
      { id: 'orders', label: 'Đơn hàng', icon: Package, badge: 6 },
      { id: 'address', label: 'Địa chỉ', icon: MapPin },
      { id: 'refunds', label: 'Hoàn tiền', icon: Banknote },
      { id: 'vouchers', label: 'Mã giảm giá', icon: Tag }
    ];
  }, [isAdminProfile]);

  const renderContent = () => {
    // Nếu là admin profile, chỉ hiển thị thông tin cá nhân
    if (isAdminProfile) {
      return <PersonalInfo userData={userData} isPending={isPending} />;
    }

    // User profile - hiển thị tất cả các tab
    switch (activeTab) {
      case 'info':
        return <PersonalInfo userData={userData} isPending={isPending} />;
      case 'orders':
        return <OrderHistoryProfile />;
      case 'address':
        return <Address />;
      case 'refunds':
        return <RefundRequests />;
      case 'vouchers':
        return <PersonalVouchers />;
      case 'favorites':
        return <PlaceholderContent title="Yêu thích" />;
      case 'reviews':
        return <PlaceholderContent title="Nhận xét" />;
      case 'affiliate':
        return <PlaceholderContent title="Quản lý tiếp thị liên kết" />;
      default:
        return <PersonalInfo userData={userData} isPending={isPending} />;
    }
  };

  return (
    <div className="h-fit bg-gray-100">
      <div className="mx-auto max-w-7xl p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex flex-col items-center">
                <div className="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-red-800 to-red-900 text-4xl font-bold text-white shadow-lg">
                  {userData?.avatar ? (
                    <img
                      src={userData.avatar}
                      alt="avatar"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">
                      {userData?.firstName?.[0]?.toUpperCase() ||
                        userData?.userName?.[0]?.toUpperCase() ||
                        'U'}
                    </span>
                  )}
                </div>
                <h3 className="text-center text-xl font-bold text-gray-900">
                  {userData?.firstName || ''} {userData?.lastName || ''}
                </h3>
                {userData?.email && (
                  <p className="mt-1 text-sm text-gray-500">{userData.email}</p>
                )}
              </div>

              {/* Menu */}
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left font-medium transition-all ${
                        isActive
                          ? 'bg-gray-900 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${isActive ? 'text-amber-400' : 'text-amber-600'}`}
                      />
                      <span className="flex-1">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
