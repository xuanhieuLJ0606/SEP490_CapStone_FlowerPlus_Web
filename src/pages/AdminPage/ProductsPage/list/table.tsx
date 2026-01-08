import DataTable from '@/components/shared/data-table';
import { columns } from './table.columns';

type TTableProps = {
  data: any[];
  pageCount: number;
};

export default function ListData({ data, pageCount }: TTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      showAdd={false}
      heightTable="50dvh"
      placeHolderInputSearch="Tìm theo tên..."
      showSearch={true}
    />
  );
}
