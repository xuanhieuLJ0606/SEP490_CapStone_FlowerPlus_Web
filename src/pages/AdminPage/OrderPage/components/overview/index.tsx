import { useSearchParams } from 'react-router-dom';
import ListData from '../../list-data';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';

import React from 'react';
import { useGetOrders, useGetRefundRequests } from '@/queries/order.query';

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

export function OverViewTab() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const pageLimit = Number(searchParams.get('limit') || 10);

  const { data: res, isPending } = useGetOrders();
  const { data: refundData, isPending: isRefundPending } =
    useGetRefundRequests();

  const { pagedData, totalRecords, pageCount } = React.useMemo(() => {
    if (!res?.data || !Array.isArray(res.data)) {
      return {
        pagedData: [],
        totalRecords: 0,
        pageCount: 0,
        revenueStats: {
          totalRevenue: 0,
          successfulRevenue: 0,
          cancelledAmount: 0,
          refundedAmount: 0,
          netRevenue: 0
        }
      };
    }

    const flatData = flattenCategories(res.data);
    const total = flatData.length;
    const startIdx = (page - 1) * pageLimit;
    const endIdx = startIdx + pageLimit;
    const pagedData = flatData.slice(startIdx, endIdx);

    // Lấy danh sách refund requests
    const refundRequests = refundData?.data || [];

    // Tạo map orderId -> refund info để tra cứu nhanh
    const refundMap = new Map();
    refundRequests.forEach((refund: any) => {
      refundMap.set(refund.orderId, {
        amount: refund.refundAmount || 0,
        status: refund.status,
        reason: refund.reason
      });
    });

    // Tính toán thống kê doanh thu
    let totalRevenue = 0;
    let successfulRevenue = 0;
    let cancelledAmount = 0;
    let refundedAmount = 0;

    flatData.forEach((order: any) => {
      const orderTotal = order.total || 0;
      const transaction = order.transaction;
      const orderId = order.id;

      totalRevenue += orderTotal;

      const isSuccessful =
        transaction?.status === 'SUCCESS' || transaction?.status === 'PAID';
      const isCancelled =
        transaction?.status === 'CANCELLED' ||
        transaction?.status === 'CANCELED' ||
        transaction?.status === 'FAILED';

      // Lấy thông tin refund
      const refundInfo = refundMap.get(orderId);
      const refundAmount = refundInfo?.amount || 0;
      const refundStatus = refundInfo?.status;

      if (isCancelled) {
        cancelledAmount += orderTotal;
      } else if (refundStatus === 'COMPLETED') {
        // Hoàn tiền đã hoàn thành
        refundedAmount += refundAmount;
        if (refundAmount < orderTotal && isSuccessful) {
          // Hoàn tiền một phần, phần còn lại vẫn tính doanh thu
          successfulRevenue += orderTotal - refundAmount;
        }
      } else if (isSuccessful) {
        // Đơn hàng thành công và chưa hoàn tiền hoặc từ chối hoàn tiền
        successfulRevenue += orderTotal;
      }
    });

    const netRevenue = successfulRevenue;

    return {
      pagedData,
      totalRecords: total,
      pageCount: Math.ceil(total / pageLimit),
      revenueStats: {
        totalRevenue,
        successfulRevenue,
        cancelledAmount,
        refundedAmount,
        netRevenue
      }
    };
  }, [res, refundData, page, pageLimit]);

  return (
    <>
      <div className="grid gap-6 rounded-md p-4 pt-0 ">
        <h1 className="text-center font-bold">DANH SÁCH ĐƠN HÀNG</h1>

        {isPending || isRefundPending ? (
          <div className="p-5">
            <DataTableSkeleton
              columnCount={10}
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
            refundData={refundData}
          />
        )}
      </div>
    </>
  );
}
