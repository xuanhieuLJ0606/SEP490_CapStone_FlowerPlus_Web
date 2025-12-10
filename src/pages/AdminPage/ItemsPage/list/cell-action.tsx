import { Button } from '@/components/ui/button';
import { useUpdateItem, useDeleteItem } from '@/queries/items.query';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

interface CellActionProps {
  data: any;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { mutateAsync: updateItem } = useUpdateItem();
  const { mutateAsync: deleteItem } = useDeleteItem();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [form, setForm] = useState({
    name: data.name || '',
    price: data.price || 0,
    description: data.description || '',
    imageIds: data.imageIds || []
  });

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập tên item',
        variant: 'destructive'
      });
      return;
    }
    if (form.name.length > 255) {
      toast({
        title: 'Lỗi',
        description: 'Tên item không được vượt quá 255 ký tự',
        variant: 'destructive'
      });
      return;
    }
    if (form.price < 0) {
      toast({
        title: 'Lỗi',
        description: 'Giá không được âm',
        variant: 'destructive'
      });
      return;
    }
    if (form.price === 0) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập giá',
        variant: 'destructive'
      });
      return;
    }

    const [err] = await updateItem({
      id: data.id,
      name: form.name,
      price: Number(form.price) || 0,
      description: form.description,
      imageIds: form.imageIds
    });

    if (err) {
      toast({
        title: 'Thất bại',
        description: err.message || 'Cập nhật thất bại',
        variant: 'destructive'
      });
      return;
    }
    toast({
      title: 'Thành công',
      description: 'Cập nhật item thành công',
      variant: 'default'
    });
    setOpenEdit(false);
  };

  const handleDelete = async () => {
    const [err] = await deleteItem(data.id);
    if (err) {
      toast({
        title: 'Thất bại',
        description: err.message || 'Xóa thất bại',
        variant: 'destructive'
      });
      return;
    }
    toast({
      title: 'Thành công',
      description: 'Xóa item thành công',
      variant: 'default'
    });
    setOpenDelete(false);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Edit button */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <Button
          className="flex items-center gap-2 bg-orange-600 text-white"
          size="icon"
          type="button"
          onClick={() => {
            setForm({
              name: data.name || '',
              price: data.price || 0,
              description: data.description || '',
              imageIds: data.imageIds || []
            });
            setOpenEdit(true);
          }}
        >
          <PencilIcon className="size-4" />
        </Button>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="flex flex-col gap-4">
            <div>
              <Label className="mb-1 block text-sm">Tên</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((s) => ({ ...s, name: e.target.value }))
                }
                placeholder="Tên item"
                required
              />
            </div>
            <div>
              <Label className="mb-1 block text-sm">Giá</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm((s) => ({ ...s, price: Number(e.target.value) }))
                }
                placeholder="0"
                required
              />
            </div>
            <div>
              <Label className="mb-1 block text-sm">Mô tả</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((s) => ({ ...s, description: e.target.value }))
                }
                placeholder="Mô tả ngắn"
              />
            </div>
            <div>
              <Label className="mb-1 block text-sm">Ảnh (imageIds)</Label>
              <Input
                placeholder="Nhập nhiều id, phân tách bởi dấu phẩy"
                value={form.imageIds.join(',')}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    imageIds: e.target.value
                      .split(',')
                      .map((x) => x.trim())
                      .filter(Boolean)
                  }))
                }
              />
            </div>
            <DialogFooter className="mt-2 gap-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
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

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <Button
          className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600"
          size="icon"
          type="button"
          onClick={() => setOpenDelete(true)}
        >
          <Trash2Icon className="size-4" />
        </Button>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa item "{data.name}"? Hành động này không
              thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
