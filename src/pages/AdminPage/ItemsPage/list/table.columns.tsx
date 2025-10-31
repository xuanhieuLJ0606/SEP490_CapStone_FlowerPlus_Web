import { ColumnDef } from '@tanstack/react-table';
import { useSearchParams } from 'react-router-dom';
import { CellAction } from './cell-action';

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'STT',
    header: 'STT',
    enableSorting: false,
    cell: ({ row }) => {
      const [searchParams] = useSearchParams();
      const pageLimit = Number(searchParams.get('limit') || 10);
      const page = Number(searchParams.get('page') || 1);
      const rowIndex = row.index;
      const serialNumber = (page - 1) * pageLimit + rowIndex + 1;
      return <span>{serialNumber}</span>;
    }
  },
  {
    accessorKey: 'name',
    header: 'Tên',
    enableSorting: true
  },
  {
    accessorKey: 'price',
    header: 'Giá',
    enableSorting: true,
    cell: ({ row }) => (
      <span>{Number(row.original.price).toLocaleString()} đ</span>
    )
  },
  {
    accessorKey: 'description',
    header: 'Mô tả',
    enableSorting: false
  },
  {
    id: 'actions',
    header: 'Hành động',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
