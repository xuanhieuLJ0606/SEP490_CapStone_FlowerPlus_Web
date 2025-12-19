import DataTable from '@/components/shared/data-table';
import { createColumns } from './columns';
type TTableProps = {
  data: any;
  page: number;
  totalUsers: number;
  pageCount: number;
  bulkActions?: any[];
  refundData?: any;
};

export default function ListData({
  data,
  pageCount,
  bulkActions,
  refundData
}: TTableProps) {
  const columns = createColumns(refundData);

  return (
    <>
      {data && (
        <DataTable
          columns={columns}
          data={data}
          pageCount={pageCount}
          showAdd={false}
          heightTable="50dvh"
          placeHolderInputSearch="Mã môn..."
          showSearch={false}
        />
      )}
    </>
  );
}
