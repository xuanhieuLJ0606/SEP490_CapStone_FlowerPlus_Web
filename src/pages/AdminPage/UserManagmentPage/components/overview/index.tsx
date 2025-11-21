import { useSearchParams } from 'react-router-dom';
import ListData from '../../list-data';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import React from 'react';
import { useGetUsers } from '@/queries/user.query';
import { Users, TruckIcon, UserCheck, UserX, Search } from 'lucide-react';
import { motion } from 'framer-motion';

function flattenCategories(data: any[]) {
  const idToNameMap = new Map<number, string>();
  function mapAllNames(list: any[]) {
    for (const item of list) {
      idToNameMap.set(item.id, item.name);
      if (item.children && item.children.length > 0) {
        mapAllNames(item.children);
      }
    }
  }
  mapAllNames(data);

  function flatten(list: any[], parentId: number | null = null) {
    let arr: any[] = [];
    for (const item of list) {
      arr.push({
        ...item,
        parentName: item.parentId
          ? idToNameMap.get(item.parentId) || null
          : null,
        childrenNames: (item.children || []).map((c: any) => c.name)
      });
      if (item.children && item.children.length > 0) {
        arr = arr.concat(flatten(item.children, item.id));
      }
    }
    return arr;
  }
  return flatten(data);
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  iconBg: string;
  index: number;
}

function StatCard({
  title,
  value,
  icon,
  bgColor,
  iconBg,
  index
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`${bgColor} rounded-xl border border-rose-100 p-6 shadow-sm transition-all duration-300 hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium ">{title}</p>
          <p className="text-3xl font-bold ">{value}</p>
        </div>
        <div className={`${iconBg} rounded-full p-4`}>{icon}</div>
      </div>
    </motion.div>
  );
}

export function OverViewTab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const pageLimit = Number(searchParams.get('limit') || 10);
  const search = searchParams.get('search') || '';

  const { data: res, isPending } = useGetUsers();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set('search', value);
      // reset về page 1 khi search
      params.set('page', '1');
    } else {
      params.delete('search');
      params.set('page', '1');
    }

    setSearchParams(params);
  };

  const { pagedData, totalRecords, pageCount, stats } = React.useMemo(() => {
    if (!res?.data || !Array.isArray(res.data)) {
      return {
        pagedData: [],
        totalRecords: 0,
        pageCount: 0,
        stats: {
          totalUsers: 0,
          deliveryUsers: 0,
          activeUsers: 0,
          inactiveUsers: 0
        }
      };
    }

    const flatData = flattenCategories(res.data);

    // Thống kê tổng (không phụ thuộc search)
    const deliveryUsers = flatData.filter(
      (user: any) => user.role === 'SHIPPER'
    ).length;
    const activeUsers = flatData.filter(
      (user: any) => user.isActive === true
    ).length;
    const inactiveUsers = flatData.filter(
      (user: any) => user.isActive === false
    ).length;

    // Lọc theo search
    const normalizedSearch = search.trim().toLowerCase();
    const filteredData = normalizedSearch
      ? flatData.filter((user: any) => {
          const name = (user.name || user.fullName || '').toString();
          const email = (user.email || '').toString();
          const phone = (user.phone || user.phoneNumber || '').toString();
          const username = (user.username || '').toString();

          const target = `${name} ${email} ${phone} ${username}`.toLowerCase();
          return target.includes(normalizedSearch);
        })
      : flatData;

    const total = filteredData.length;
    const startIdx = (page - 1) * pageLimit;
    const endIdx = startIdx + pageLimit;
    const pagedData = filteredData.slice(startIdx, endIdx);

    return {
      pagedData,
      totalRecords: total,
      pageCount: Math.ceil(total / pageLimit),
      stats: {
        totalUsers: flatData.length,
        deliveryUsers,
        activeUsers,
        inactiveUsers
      }
    };
  }, [res, page, pageLimit, search]);

  return (
    <div className="space-y-6 p-4 pt-0">
      {/* Stats Cards */}
      {isPending ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-rose-50" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Tổng Người Dùng"
            value={stats.totalUsers}
            icon={<Users className="h-6 w-6 " />}
            bgColor="bg-gradient-to-br from-rose-50 to-pink-50"
            iconBg="bg-rose-100"
            index={0}
          />
          <StatCard
            title="Nhân Viên Giao Hàng"
            value={stats.deliveryUsers}
            icon={<TruckIcon className="h-6 w-6 " />}
            bgColor="bg-gradient-to-br from-rose-50 to-pink-50"
            iconBg="bg-rose-100"
            index={1}
          />
          <StatCard
            title="Đang Hoạt Động"
            value={stats.activeUsers}
            icon={<UserCheck className="h-6 w-6 " />}
            bgColor="bg-gradient-to-br from-emerald-50 to-green-50"
            iconBg="bg-emerald-100"
            index={2}
          />
          <StatCard
            title="Không Hoạt Động"
            value={stats.inactiveUsers}
            icon={<UserX className="h-6 w-6 text-gray-600" />}
            bgColor="bg-gradient-to-br from-gray-50 to-slate-50"
            iconBg="bg-gray-100"
            index={3}
          />
        </div>
      )}

      {/* Data Table */}
      <div className="rounded-xl border border-rose-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold ">Danh Sách Người Dùng</h2>
            <p className="mt-1 text-sm ">
              Quản lý thông tin chi tiết của tất cả người dùng
            </p>
          </div>

          {/* Ô search */}
          <div className="relative w-full md:w-64">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Tìm kiếm tên, email, SĐT..."
              className="w-full rounded-lg border border-rose-100 bg-rose-50/40 py-2 pl-9 pr-3 text-sm outline-none ring-0 transition focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-100"
            />
          </div>
        </div>

        {isPending ? (
          <DataTableSkeleton
            columnCount={10}
            filterableColumnCount={2}
            searchableColumnCount={1}
          />
        ) : (
          <ListData
            data={pagedData}
            page={page}
            totalUsers={totalRecords}
            pageCount={pageCount}
          />
        )}
      </div>
    </div>
  );
}
