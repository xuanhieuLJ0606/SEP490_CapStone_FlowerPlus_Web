import { useSearchParams } from 'react-router-dom';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import { useGetItemsByPaging } from '@/queries/items.query';
import ListData from './table';

export function OverViewTab() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const pageLimit = Number(searchParams.get('limit') || 10);
  const { data: res, isPending } = useGetItemsByPaging(page, pageLimit);

  const totalRecords = res?.pagination?.totalElements ?? res?.total ?? 0;
  const pageCount = Math.ceil(totalRecords / pageLimit) || 1;

  return (
    <div className="grid gap-6 rounded-md p-4 pt-0 ">
      <h1 className="text-center font-bold">DANH SÁCH ITEMS</h1>
      {isPending ? (
        <div className="p-5">
          <DataTableSkeleton
            columnCount={8}
            filterableColumnCount={2}
            searchableColumnCount={1}
          />
        </div>
      ) : (
        <ListData data={res?.data || res?.items || []} pageCount={pageCount} />
      )}
    </div>
  );
}
