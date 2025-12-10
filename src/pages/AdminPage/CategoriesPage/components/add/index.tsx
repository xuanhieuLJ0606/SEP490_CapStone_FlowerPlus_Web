import React, { useState } from 'react';
import {
  useCreateCategory,
  useGetCategories
} from '@/queries/categories.query';

export default function Add() {
  const { mutateAsync: createCategory } = useCreateCategory();
  const { data: resCategories } = useGetCategories();
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const categories = resCategories?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!name.trim()) {
      setError('Vui lòng nhập tên danh mục');
      return;
    }
    if (name.length > 255) {
      setError('Tên danh mục không được vượt quá 255 ký tự');
      return;
    }
    setLoading(true);
    try {
      await createCategory({
        name,
        parentId:
          parentId === null || parentId === undefined || parentId === 0
            ? null
            : parentId
      });
      setSuccess(true);
      setName('');
      setParentId(null);
    } catch (err: any) {
      setError('Thêm danh mục thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-xl rounded-md border bg-white p-6 shadow">
      <h2 className="mb-4 text-lg font-bold">Thêm danh mục</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Tên danh mục</label>
          <input
            type="text"
            className="w-full rounded border px-3 py-2"
            placeholder="VD: Lãng hoa khai trương"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Danh mục cha (nếu có)
          </label>
          <select
            className="w-full rounded border px-3 py-2"
            value={parentId ?? ''}
            onChange={(e) =>
              setParentId(e.target.value === '' ? null : Number(e.target.value))
            }
          >
            <option value="">-- Không có danh mục cha --</option>
            {categories &&
              Array.isArray(categories) &&
              categories
                .filter((cat: any) => cat.parentId === null)
                .map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
          </select>
        </div>
        {error && <div className="text-sm text-red-500">{error}</div>}
        {success && (
          <div className="text-sm text-green-600">
            Thêm danh mục thành công!
          </div>
        )}
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? 'Đang thêm...' : 'Thêm danh mục'}
        </button>
      </form>
    </div>
  );
}
