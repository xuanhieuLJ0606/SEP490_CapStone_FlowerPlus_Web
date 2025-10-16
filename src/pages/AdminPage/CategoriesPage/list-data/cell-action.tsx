import { Button } from '@/components/ui/button';
import {
  useGetCategories,
  useUpdateCategory
} from '@/queries/categories.query';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

interface CellActionProps {
  data: any;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { mutateAsync: updateCategory } = useUpdateCategory();
  const { data: resCategories } = useGetCategories();
  const categories = resCategories?.data || [];
  const [openEdit, setOpenEdit] = useState(false);
  const [editName, setEditName] = useState(data.name);
  const [editParentId, setEditParentId] = useState(data.parentId ?? null);

  const selectableParents = useMemo(
    () => categories.filter((cat: any) => cat.id !== data.id),
    [categories, data.id]
  );

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const [err] = await updateCategory({
      id: data.id,
      name: editName,
      parentId: editParentId ? editParentId : null
    });
    console.log('err', err);
    if (err) {
      console.log('err', err);
      toast({
        title: 'Thất bại',
        description: err.message,
        variant: 'destructive'
      });
      return;
    }
    toast({
      title: 'Thành công',
      description: 'Cập nhật danh mục thành công',
      variant: 'success'
    });
    setOpenEdit(false);
  };

  return (
    <div className="flex items-center gap-2">
      {/* View button */}
      {/* <Dialog open={openView} onOpenChange={setOpenView}>
        <Button
          className="flex items-center gap-2 bg-green-600 text-white"
          size="icon"
          type="button"
          onClick={() => setOpenView(true)}
        >
          <EyeOpenIcon className="size-4" />
        </Button>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              Danh mục con của{' '}
              <span className="font-bold text-rose-800">{data.name}</span>
            </DialogTitle>
          </DialogHeader>
          {children.length === 0 ? (
            <div>Không có danh mục con</div>
          ) : (
            <ul className="list-disc pl-4">
              {children.map((child) => (
                <li key={child.id}>{child.name}</li>
              ))}
            </ul>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button
                size="sm"
                className="mt-2 bg-gray-200 text-gray-700"
                type="button"
              >
                Đóng
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      {/* Edit button */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <Button
          className="flex items-center gap-2 bg-orange-600 text-white"
          size="icon"
          type="button"
          onClick={() => {
            setEditName(data.name);
            setEditParentId(data.parentId ?? null);
            setOpenEdit(true);
          }}
        >
          <PencilIcon className="size-4" />
        </Button>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block font-medium">
                Tên danh mục
                <input
                  type="text"
                  className="mt-1 w-full rounded border px-2 py-1"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </label>
            </div>
            <div>
              <label className="mb-1 block font-medium">
                Danh mục cha
                <select
                  className="mt-1 w-full rounded border px-2 py-1"
                  value={editParentId ?? ''}
                  onChange={(e) =>
                    setEditParentId(
                      e.target.value === '' ? null : Number(e.target.value)
                    )
                  }
                >
                  <option value="">Không</option>
                  {selectableParents.map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <DialogFooter className="mt-2 gap-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  size="sm"
                  className="bg-gray-200 text-gray-700"
                  onClick={() => setOpenEdit(false)}
                >
                  Hủy
                </Button>
              </DialogClose>
              <Button
                type="submit"
                size="sm"
                className="bg-blue-600 text-white"
              >
                Lưu
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete button - Chưa triển khai */}
      <Button
        className="flex items-center gap-2 bg-red-500 text-white"
        size="icon"
        type="button"
        // onClick={} // Có thể triển khai xoá sau
      >
        <Trash2Icon className="size-4" />
      </Button>
    </div>
  );
};