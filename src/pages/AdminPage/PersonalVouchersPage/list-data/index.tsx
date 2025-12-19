import DataTable from '@/components/shared/data-table';
import { columns, PersonalVoucher } from './columns';

interface ListDataProps {
  data: PersonalVoucher[];
  page: number;
  totalRecords: number;
  pageCount: number;
}

export default function ListData({
  data,
  page,
  totalRecords,
  pageCount
}: ListDataProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      showAdd={false}
      heightTable="50dvh"
      placeHolderInputSearch="Tìm kiếm theo mã voucher..."
      showSearch={true}
    />
  );
}
