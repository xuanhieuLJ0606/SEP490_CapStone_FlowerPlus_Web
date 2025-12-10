import { useSearchParams } from 'react-router-dom';
import ListData from '../../list-data';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import { useGetCategories } from '@/queries/categories.query';
import React from 'react';

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

  const { data: res, isPending } = useGetCategories(false);

  const { pagedData, totalRecords, pageCount } = React.useMemo(() => {
    if (!res?.data || !Array.isArray(res.data)) {
      return {
        pagedData: [],
        totalRecords: 0,
        pageCount: 0
      };
    }
    const flatData = flattenCategories(res.data);
    const total = flatData.length;
    const startIdx = (page - 1) * pageLimit;
    const endIdx = startIdx + pageLimit;
    const pagedData = flatData.slice(startIdx, endIdx);
    return {
      pagedData,
      totalRecords: total,
      pageCount: Math.ceil(total / pageLimit)
    };
  }, [res, page, pageLimit]);

  return (
    <>
      <div className="grid gap-6 rounded-md p-4 pt-0 ">
        <h1 className="text-center font-bold">DANH SÁCH DANH MỤC</h1>
        {isPending ? (
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
          />
        )}
      </div>
    </>
  );
}
