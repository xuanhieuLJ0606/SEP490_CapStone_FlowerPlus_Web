import { useSearchParams } from 'react-router-dom';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import ListData from './table';
import { useGetListProductByPaging } from '@/queries/product.query';
import { ManualSyncButtons } from '@/components/shared/manual-sync-buttons';

export const TYPE_PRODUCT = {
  FLOWER: 'FLOWER',
  ITEM: 'ITEM',
  PRODUCT: 'PRODUCT'
};

const TYPE_OPTIONS = [
  { value: '', label: 'Tất cả loại' },
  { value: TYPE_PRODUCT.PRODUCT, label: 'PRODUCT' },
  { value: TYPE_PRODUCT.FLOWER, label: 'FLOWER' },
  { value: TYPE_PRODUCT.ITEM, label: 'ITEM' }
];

export function OverViewTab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const pageLimit = Number(searchParams.get('limit') || 10);
  const keyword = searchParams.get('keyword') || '';
  const type = searchParams.get('type') || '';
  const { data: res, isPending } = useGetListProductByPaging(
    page,
    pageLimit,
    keyword,
    type
  );

  const totalRecords = res?.totalRecords || 0;
  const pageCount = Math.ceil(totalRecords / pageLimit) || 1;

  const handleChangeType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = new URLSearchParams(searchParams);
    next.set('type', e.target.value);
    next.set('page', '1'); // reset page on filter change
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="grid gap-6 rounded-md p-4 pt-0 ">
      <div className="flex items-center justify-between">
        <h1 className="text-center font-bold">DANH SÁCH PRODUCTS</h1>
        <ManualSyncButtons size="sm" />
      </div>
      <div className="flex items-center gap-4 p-2">
        <label htmlFor="type-select" className="font-medium">
          Loại:
        </label>
        <select
          id="type-select"
          className="rounded-md border border-gray-300 px-2 py-1"
          value={type}
          onChange={handleChangeType}
        >
          {TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {isPending ? (
        <div className="p-5">
          <DataTableSkeleton
            columnCount={8}
            filterableColumnCount={2}
            searchableColumnCount={1}
          />
        </div>
      ) : (
        <ListData data={res?.listObjects || []} pageCount={pageCount} />
      )}
    </div>
  );
}
