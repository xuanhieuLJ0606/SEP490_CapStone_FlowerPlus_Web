import { useSearchParams } from 'react-router-dom';
import ListData from '../../list-data';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import React from 'react';
import { useGetRefundRequests } from '@/queries/order.query';

export function OverViewTab() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const pageLimit = Number(searchParams.get('limit') || 10);

  const { data: res, isPending } = useGetRefundRequests();

  const { pagedData, totalRecords, pageCount } = React.useMemo(() => {
    if (!res?.data || !Array.isArray(res.data)) {
      return {
        pagedData: [],
        totalRecords: 0,
        pageCount: 0
      };
    }
    const total = res.data.length;
    const startIdx = (page - 1) * pageLimit;
    const endIdx = startIdx + pageLimit;
    const pagedData = res.data.slice(startIdx, endIdx);
    return {
      pagedData,
      totalRecords: total,
      pageCount: Math.ceil(total / pageLimit)
    };
  }, [res, page, pageLimit]);

  return (
    <>
      <div className="grid gap-6 rounded-md p-4 pt-0">
        <h1 className="text-center font-bold">DANH SÁCH YÊU CẦU HOÀN TIỀN</h1>
        {isPending ? (
          <div className="p-5">
            <DataTableSkeleton
              columnCount={8}
              filterableColumnCount={2}
              searchableColumnCount={1}
            />
          </div>
        ) : (
          <ListData
            data={pagedData}
            page={page}
            totalUsers={totalRecords}
            pageCount={pageCount}
          />
        )}
      </div>
    </>
  );
}
