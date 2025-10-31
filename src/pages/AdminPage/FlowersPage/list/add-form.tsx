import React, { useState } from 'react';
import { useCreateFlower } from '@/queries/flowers.query';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export function AddFlowerForm() {
  const { mutateAsync: createFlower } = useCreateFlower();
  const [form, setForm] = useState({
    id: 0,
    name: '',
    quality: '',
    description: '',
    price: 0,
    season: ''
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
      id: Number(form.id) || 0,
      name: form.name,
      quality: form.quality,
      description: form.description,
      price: Number(form.price) || 0,
      season: form.season
    };
    try {
      await createFlower(payload);
      setSuccess(true);
      setForm({
        id: 0,
        name: '',
        quality: '',
        description: '',
        price: 0,
        season: ''
      });
    } catch (err) {
      setError('Thao tác thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-xl rounded-md border bg-white p-6 shadow">
      <h2 className="mb-4 text-lg font-bold">Thêm Flower</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="mb-1 block text-sm">Tên</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            placeholder="Tên hoa"
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
        {error && <div className="text-sm text-red-500">{error}</div>}
        {success && <div className="text-sm text-green-600">Thành công!</div>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </form>
    </div>
  );
}
