import { useSearchParams } from 'react-router-dom';
import ListData from '../../list-data';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useGetPersonalVouchers } from '@/queries/personal-voucher.query';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export function OverViewTab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const pageLimit = Number(searchParams.get('limit') || 10);
  const search = searchParams.get('search') || '';
  const isUsedFilter = searchParams.get('isUsed') || '';
  const createdByFilter = searchParams.get('createdBy') || '';

  const { data: res, isPending } = useGetPersonalVouchers({
    page: page - 1, // API uses 0-based indexing
    size: pageLimit,
    userId: null,
    isUsed: isUsedFilter ? isUsedFilter === 'true' : undefined,
    createdBy: createdByFilter || undefined
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set('search', value);
      params.set('page', '1');
    } else {
      params.delete('search');
      params.set('page', '1');
    }

    setSearchParams(params);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value && value !== 'all') {
      params.set(filterType, value);
    } else {
      params.delete(filterType);
    }
    params.set('page', '1');

    setSearchParams(params);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    params.set('page', '1');
    params.set('limit', pageLimit.toString());
    setSearchParams(params);
  };

  console.log(res?.data?.listObjects);
  const { pagedData, totalRecords, pageCount, stats } = React.useMemo(() => {
    if (!res?.data?.listObjects || !Array.isArray(res?.data?.listObjects)) {
      return {
        pagedData: [],
        totalRecords: 0,
        pageCount: 0,
        stats: {
          totalVouchers: 0,
          usedVouchers: 0,
          activeVouchers: 0,
          expiredVouchers: 0
        }
      };
    }

    const data = res?.data?.listObjects;

    // Filter by search if needed (client-side for now)
    const normalizedSearch = search.trim().toLowerCase();
    const filteredData = normalizedSearch
      ? data?.filter((voucher: any) => {
          const code = (voucher.code || '').toString().toLowerCase();
          const userName = (voucher.userName || '').toString().toLowerCase();
          const userEmail = (voucher.userEmail || '').toString().toLowerCase();
          const createdBy = (voucher.createdBy || '').toString().toLowerCase();

          const target = `${code} ${userName} ${userEmail} ${createdBy}`;
          return target.includes(normalizedSearch);
        })
      : data;

    // Calculate stats
    const usedVouchers = data.filter((v: any) => v.isUsed).length;
    const activeVouchers = data.filter(
      (v: any) => v.isActive && !v.isUsed
    ).length;
    const expiredVouchers = data.filter((v: any) => v.isExpired).length;

    return {
      pagedData: filteredData,
      totalRecords: res.data.totalElements || 0,
      pageCount: res.data.totalPages || 0,
      stats: {
        totalVouchers: data.length,
        usedVouchers,
        activeVouchers,
        expiredVouchers
      }
    };
  }, [res, search]);

  return (
    <div className="space-y-6 p-4 pt-0">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Tổng voucher</p>
              <p className="text-2xl font-bold text-blue-700">
                {stats.totalVouchers}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-green-100 bg-green-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">
                Đang hoạt động
              </p>
              <p className="text-2xl font-bold text-green-700">
                {stats.activeVouchers}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-orange-100 bg-orange-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Đã sử dụng</p>
              <p className="text-2xl font-bold text-orange-700">
                {stats.usedVouchers}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-red-100 bg-red-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Đã hết hạn</p>
              <p className="text-2xl font-bold text-red-700">
                {stats.expiredVouchers}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-xl border border-rose-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Danh Sách Voucher Cá Nhân</h2>
            <p className="mt-1 text-sm text-gray-600">
              Quản lý voucher cá nhân đã tạo
            </p>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            {/* Filters */}
            <div className="flex gap-2">
              <Select
                value={isUsedFilter || 'all'}
                onValueChange={(value) => handleFilterChange('isUsed', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="false">Chưa dùng</SelectItem>
                  <SelectItem value="true">Đã dùng</SelectItem>
                </SelectContent>
              </Select>

              {(isUsedFilter || createdByFilter) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="px-3"
                >
                  <Filter className="h-4 w-4" />
                  Xóa bộ lọc
                </Button>
              )}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Tìm kiếm voucher, user..."
                className="w-full rounded-lg border border-rose-100 bg-rose-50/40 py-2 pl-9 pr-3 text-sm outline-none ring-0 transition focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-100"
              />
            </div>
          </div>
        </div>

        {isPending ? (
          <DataTableSkeleton
            columnCount={8}
            filterableColumnCount={2}
            searchableColumnCount={1}
          />
        ) : (
          <ListData
            data={pagedData}
            page={page}
            totalRecords={totalRecords}
            pageCount={pageCount}
          />
        )}
      </div>
    </div>
  );
}
