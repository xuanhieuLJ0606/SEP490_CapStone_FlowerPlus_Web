import { Button } from '@/components/ui/button';
import {
  useGetCategories,
  useUpdateCategory
} from '@/queries/categories.query';
import { PencilIcon, Trash2Icon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { SyncItemButton } from '@/components/shared/sync-item-button';
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface CellActionProps {
  data: any;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { mutateAsync: updateCategory } = useUpdateCategory();
  const { data: resCategories } = useGetCategories();
  const categories = resCategories?.data || [];
  const [openEdit, setOpenEdit] = useState(false);
  const [editName, setEditName] = useState(data.name);
  const [editDescription, setEditDescription] = useState(
    data.description || ''
  );
  const [editParentId, setEditParentId] = useState(data.parentId ?? null);
  const [editIsPublic, setEditIsPublic] = useState(data.isPublic ?? true);

  const selectableParents = useMemo(
    () => categories.filter((cat: any) => cat.id !== data.id),
    [categories, data.id]
  );

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editName.trim()) {
      toast({
        title: '❌ Lỗi',
        description: 'Vui lòng nhập tên danh mục',
        variant: 'destructive'
      });
      return;
    }
    if (editName.length > 255) {
      toast({
        title: '❌ Lỗi',
        description: 'Tên danh mục không được vượt quá 255 ký tự',
        variant: 'destructive'
      });
      return;
    }

    const [err] = await updateCategory({
      id: data.id,
      name: editName,
      description: editDescription,
      parentId: editParentId ? editParentId : null,
      isPublic: editIsPublic
    });

    if (err) {
      toast({
        title: '❌ Thất bại',
        description: err.message,
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: '✅ Thành công',
      description: 'Cập nhật danh mục thành công',
      variant: 'success'
    });
    setOpenEdit(false);
  };

  const handleOpenEdit = () => {
    setEditName(data.name);
    setEditDescription(data.description || '');
    setEditParentId(data.parentId ?? null);
    setEditIsPublic(data.isPublic ?? true);
    setOpenEdit(true);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Sync button */}
      <SyncItemButton type="category" id={data.id} />

      {/* Edit button */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <Button
          className="group relative overflow-hidden bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md transition-all hover:from-rose-600 hover:to-pink-600 hover:shadow-lg"
          size="icon"
          type="button"
          onClick={handleOpenEdit}
        >
          <PencilIcon className="size-4 transition-transform group-hover:scale-110" />
        </Button>

        <DialogContent className="max-w-md border-rose-100 shadow-xl">
          <DialogHeader className="space-y-3 border-b border-rose-100 pb-4">
            <DialogTitle className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-2xl font-semibold text-transparent">
              🌸 Chỉnh sửa danh mục
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEdit} className="space-y-5 py-4">
            {/* Tên danh mục */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Tên danh mục <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                placeholder="Nhập tên danh mục..."
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>

            {/* Mô tả */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Mô tả
              </Label>
              <Textarea
                id="description"
                className="min-h-[80px] resize-none border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                placeholder="Mô tả về danh mục này..."
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>

            {/* Danh mục cha */}
            <div className="space-y-2">
              <Label
                htmlFor="parent"
                className="text-sm font-medium text-gray-700"
              >
                Danh mục cha
              </Label>
              <Select
                value={editParentId?.toString() ?? 'none'}
                onValueChange={(value) =>
                  setEditParentId(value === 'none' ? null : Number(value))
                }
              >
                <SelectTrigger className="border-rose-200 focus:border-rose-400 focus:ring-rose-400">
                  <SelectValue placeholder="Chọn danh mục cha..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <span className="text-gray-500">Không có</span>
                  </SelectItem>
                  {selectableParents.map((parent) => (
                    <SelectItem key={parent.id} value={parent.id.toString()}>
                      {parent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Trạng thái công khai */}
            <div className="flex items-center justify-between rounded-lg border border-rose-200 bg-rose-50/50 p-4">
              <div className="flex items-center gap-3">
                {editIsPublic ? (
                  <EyeIcon className="size-5 text-rose-500" />
                ) : (
                  <EyeOffIcon className="size-5 text-gray-400" />
                )}
                <div>
                  <Label
                    htmlFor="isPublic"
                    className="cursor-pointer text-sm font-medium text-gray-700"
                  >
                    Công khai danh mục
                  </Label>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {editIsPublic
                      ? 'Mọi người có thể xem'
                      : 'Chỉ bạn có thể xem'}
                  </p>
                </div>
              </div>
              <Switch
                id="isPublic"
                checked={editIsPublic}
                onCheckedChange={setEditIsPublic}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-rose-500 data-[state=checked]:to-pink-500"
              />
            </div>

            {/* Footer buttons */}
            <DialogFooter className="gap-2 border-t border-rose-100 pt-4">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50"
                  onClick={() => setOpenEdit(false)}
                >
                  Hủy bỏ
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md hover:from-rose-600 hover:to-pink-600 hover:shadow-lg"
              >
                💾 Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete button */}
      <Button
        className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md transition-all hover:from-red-600 hover:to-rose-600 hover:shadow-lg"
        size="icon"
        type="button"
        // onClick={handleDelete} // Có thể triển khai xoá sau
      >
        <Trash2Icon className="size-4 transition-transform group-hover:scale-110" />
      </Button>
    </div>
  );
};
