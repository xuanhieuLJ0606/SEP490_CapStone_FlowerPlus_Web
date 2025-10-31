import { Button } from '@/components/ui/button';
import { useUpdateFlower } from '@/queries/flowers.query';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

interface CellActionProps {
  data: any;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { mutateAsync: updateFlower } = useUpdateFlower();
  const [openEdit, setOpenEdit] = useState(false);
  const [form, setForm] = useState({
    name: data.name || '',
    quality: data.quality || '',
    description: data.description || '',
    price: data.price || 0,
    season: data.season || '',
    status: data.status || ''
  });

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const [err] = await updateFlower({
      id: data.id,
      name: form.name,
      quality: form.quality,
      description: form.description,
      price: Number(form.price) || 0,
      status: form.status,
      season: form.season
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
      description: 'Cập nhật flower thành công',
      variant: 'default'
    });
    setOpenEdit(false);
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
              quality: data.quality || '',
              description: data.description || '',
              price: data.price || 0,
              season: data.season || '',
              status: data.status || ''
            });
            setOpenEdit(true);
          }}
        >
          <PencilIcon className="size-4" />
        </Button>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Flower</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="flex flex-col gap-4">
            <div>
              <Label className="mb-1 block text-sm">Tên</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((s) => ({ ...s, name: e.target.value }))
                }
                placeholder="Tên hoa"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1 block text-sm">Chất lượng</Label>
                <Input
                  value={form.quality}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, quality: e.target.value }))
                  }
                  placeholder="A/B/C..."
                />
              </div>
              <div>
                <Label className="mb-1 block text-sm">Mùa</Label>
                <Input
                  value={form.season}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, season: e.target.value }))
                  }
                  placeholder="Xuân/Hạ/Thu/Đông"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                <Label className="mb-1 block text-sm">Trạng thái</Label>
                <Input
                  value={form.status}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, status: e.target.value }))
                  }
                  placeholder="ACTIVE/INACTIVE"
                />
              </div>
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
