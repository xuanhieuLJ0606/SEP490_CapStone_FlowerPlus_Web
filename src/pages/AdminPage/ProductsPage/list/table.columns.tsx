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
    header: 'Tên sản phẩm',
    enableSorting: true,
    cell: ({ row }) => <span>{row.original.name}</span>
  },
  {
    accessorKey: 'description',
    header: 'Mô tả',
    enableSorting: false,
    cell: ({ row }) => <span>{row.original.description || ''}</span>
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
    accessorKey: 'stock',
    header: 'Tồn kho',
    enableSorting: true,
    cell: ({ row }) => <span>{row.original.stock}</span>
  },
  {
    accessorKey: 'productType',
    header: 'Loại sản phẩm',
    enableSorting: false,
    cell: ({ row }) => <span>{row.original.productType}</span>
  },
  {
    accessorKey: 'isActive',
    header: 'Trạng thái',
    enableSorting: false,
    cell: ({ row }) => (
      <span>{row.original.isActive ? 'Hoạt động' : 'Ngưng'}</span>
    )
  },
  {
    accessorKey: 'images',
    header: 'Ảnh',
    enableSorting: false,
    cell: ({ row }) => {
      // images được stringify, parse lại để lấy ảnh
      let images: any[] = [];
      try {
        if (typeof row.original.images === 'string') {
          images = JSON.parse(row.original.images);
        } else if (Array.isArray(row.original.images)) {
          images = row.original.images;
        }
      } catch (e) {
        // nếu lỗi parse, dùng rỗng
        images = [];
      }
      let firstImg = '';
      if (Array.isArray(images) && images.length > 0) {
        if (typeof images[0] === 'string') {
          firstImg = images[0];
        } else if (typeof images[0] === 'object' && images[0]?.url) {
          firstImg = images[0].url;
        }
      }
      return firstImg ? (
        <img
          src={firstImg}
          alt={row.original.name}
          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }}
        />
      ) : null;
    }
  },
  {
    accessorKey: 'categories',
    header: 'Danh mục',
    enableSorting: false,
    cell: ({ row }) => (
      <span>
        {Array.isArray(row.original.categories)
          ? row.original.categories.map((c: any) => c.name).join(', ')
          : ''}
      </span>
    )
  },
  {
    accessorKey: 'compositions',
    header: 'Thành phần',
    enableSorting: false,
    cell: ({ row }) => {
      const compositions = Array.isArray(row.original.compositions)
        ? row.original.compositions
        : [];
      return (
        <span>
          {compositions
            .map(
              (c: any) =>
                `${c.childName} (${c.childType === 'FLOWER' ? 'Hoa' : 'Vật phẩm'}: ${c.quantity})`
            )
            .join(', ')}
        </span>
      );
    }
  },
  {
    id: 'actions',
    header: 'Hành động',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
