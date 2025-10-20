import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import __helpers from '@/helpers';
import { useSearchParams } from 'react-router-dom';

// const StudentPaperStatus = {
//   UPLOADED: 0,
//   WAITING: 1,
//   DONE: 2
// };

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'STT',
    header: 'STT',
    enableSorting: true,
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
    header: 'Tên sản phẩm',
    enableSorting: true
  },

  {
    accessorKey: 'parentName',
    header: 'Danh mục cha',
    enableSorting: false,
    cell: ({ row }) => {
      return <span>{row.original.parentName || 'Không'}</span>;
    }
  },

  {
    id: 'actions',
    header: 'Hành động',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];