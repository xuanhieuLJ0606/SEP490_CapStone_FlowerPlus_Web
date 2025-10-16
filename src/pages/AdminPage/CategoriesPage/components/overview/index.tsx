import { useSearchParams } from 'react-router-dom';
import ListData from '../../list-data';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import { useGetCategoriesByPaging } from '@/queries/categories.query';
import React from 'react';

export function OverViewTab() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const pageLimit = Number(searchParams.get('limit') || 10);
  const keyword = searchParams.get('keyword') || '';
  const { data: res, isPending } = useGetCategoriesByPaging(
    page,
    pageLimit,
    keyword
  );

  const listObjects = React.useMemo(() => {
    if (!res?.data || !Array.isArray(res.data)) return res?.data;
    const idToNameMap = new Map();
    res.data.forEach((item: any) => {
      idToNameMap.set(item.id, item.name);
    });

    const parentIdToChildrenMap = new Map();
    res.data.forEach((item: any) => {
      if (item.parentId) {
        if (!parentIdToChildrenMap.has(item.parentId)) {
          parentIdToChildrenMap.set(item.parentId, []);
        }
        parentIdToChildrenMap.get(item.parentId).push(item.name);
      }
    });

    return res.data.map((item: any) => ({
      ...item,
      parentName: item.parentId ? idToNameMap.get(item.parentId) || null : null,
      childrenNames: parentIdToChildrenMap.has(item.id)
        ? parentIdToChildrenMap.get(item.id)
        : []
    }));
  }, [res]);

  const totalRecords = res?.pagination?.totalElements;
  const pageCount = Math.ceil(totalRecords / pageLimit);
  console.log('listObjects', listObjects);
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
            data={listObjects}
            page={totalRecords}
            totalUsers={totalRecords}
            pageCount={pageCount}
          />
        )}
      </div>
    </>
  );
}