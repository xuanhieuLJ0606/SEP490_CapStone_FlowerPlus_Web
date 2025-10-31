import React, { useState } from 'react';
import { useCreateItem } from '@/queries/items.query';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export function AddItemForm() {
  const { mutateAsync: createItem } = useCreateItem();
  const [form, setForm] = useState({
    name: '',
    price: 0,
    description: '',
    imageIds: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!form.name.trim()) {
      setError('Vui lòng nhập tên');
      return;
    }
    setLoading(true);
    const payload = {
      name: form.name,
      price: Number(form.price) || 0,
      description: form.description,
      imageIds: form.imageIds
    };
    try {
      await createItem(payload);
      setSuccess(true);
      setForm({ name: '', price: 0, description: '', imageIds: [] });
    } catch (err) {
      setError('Thao tác thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-xl rounded-md border bg-white p-6 shadow">
      <h2 className="mb-4 text-lg font-bold">Thêm Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="mb-1 block text-sm">Tên</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            placeholder="Nhập tên item"
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
        {error && <div className="text-sm text-red-500">{error}</div>}
        {success && <div className="text-sm text-green-600">Thành công!</div>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </form>
    </div>
  );
}
