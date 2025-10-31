import { Button } from '@/components/ui/button';
import { useUpdateProduct } from '@/queries/products.query';
import { useGetCategories } from '@/queries/categories.query';
import { useGetListProductByPaging } from '@/queries/product.query';
import { TYPE_PRODUCT } from './overview';
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
// removed Select import (không dùng trong edit)
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

interface CellActionProps {
  data: any;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const { data: resCategories } = useGetCategories();
  const { data: resFlowers } = useGetListProductByPaging(
    1,
    100,
    '',
    TYPE_PRODUCT.FLOWER
  );
  const { data: resItems } = useGetListProductByPaging(
    1,
    100,
    '',
    TYPE_PRODUCT.ITEM
  );

  const categories = resCategories?.data || [];
  const flowers = resFlowers?.data || resFlowers?.items || [];
  const items = resItems?.data || resItems?.items || [];

  const [openEdit, setOpenEdit] = useState(false);
  const [openFlower, setOpenFlower] = useState(false);
  const [openItem, setOpenItem] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [form, setForm] = useState({
    // common
    name: data.name || '',
    description: data.description || '',
    price: Number(data.price) || 0,
    stock: Number(data.stock) || 0,
    isPublic: Boolean(data.isPublic ?? true),
    type: data.type as string,
    vector: (data.vector as string) || '',
    imageUrls: Array.isArray(data.images)
      ? (data.images as any[])
          .slice(1)
          .map((img: any) => img?.url)
          .filter(Boolean)
      : data.imageUrls || [],
    mainImageUrl:
      Array.isArray(data.images) && data.images.length > 0
        ? (data.images[0]?.url as string)
        : data.mainImageUrl || '',
    // selections
    flowerSelections: (Array.isArray(data.children) ? data.children : [])
      .filter((c: any) => c?.type === TYPE_PRODUCT.FLOWER)
      .map((c: any) => ({
        childId: c.id,
        name: c.name,
        quantity: Number(c.quantity) || 1
      })),
    itemSelections: (Array.isArray(data.children) ? data.children : [])
      .filter((c: any) => c?.type === TYPE_PRODUCT.ITEM)
      .map((c: any) => ({
        childId: c.id,
        name: c.name,
        quantity: Number(c.quantity) || 1
      })),
    categorySelections: (Array.isArray(data.categories)
      ? data.categories
      : []
    ).map((c: any) => ({ childId: c.id, name: c.name, quantity: 1 }))
  });

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    // build payload giống create, kèm id, và không cho đổi type
    const payload: any = {
      id: data.id,
      name: form.name,
      description: form.description,
      stock: Number(form.stock) || 0,
      price: Number(form.price) || 0,
      isPublic: true,
      isCustom: true,
      type: data.type,
      vector: form.vector,
      imageUrls: (form.imageUrls || []).filter(Boolean),
      mainImageUrl: form.mainImageUrl
    };

    if (data.type === TYPE_PRODUCT.FLOWER || data.type === TYPE_PRODUCT.ITEM) {
      payload.categoryIds = (form.categorySelections || []).map(
        (c: any) => c.childId
      );
    }
    if (data.type === TYPE_PRODUCT.PRODUCT) {
      payload.children = [
        ...form.flowerSelections.map((f: any) => ({
          childId: f.childId,
          quantity: Number(f.quantity) || 1
        })),
        ...form.itemSelections.map((i: any) => ({
          childId: i.childId,
          quantity: Number(i.quantity) || 1
        }))
      ];
    }

    try {
      await updateProduct(payload as any);
      toast({
        title: 'Thành công',
        description: 'Cập nhật product thành công',
        variant: 'default'
      });
      setOpenEdit(false);
    } catch (error: any) {
      toast({
        title: 'Thất bại',
        description: error?.message || 'Cập nhật thất bại',
        variant: 'destructive'
      });
    }
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
              description: data.description || '',
              price: Number(data.price) || 0,
              stock: Number(data.stock) || 0,
              isPublic: Boolean(data.isPublic ?? true),
              type: data.type,
              vector: (data.vector as string) || '',
              imageUrls: Array.isArray(data.images)
                ? (data.images as any[])
                    .slice(1)
                    .map((img: any) => img?.url)
                    .filter(Boolean)
                : data.imageUrls || [],
              mainImageUrl:
                Array.isArray(data.images) && data.images.length > 0
                  ? (data.images[0]?.url as string)
                  : data.mainImageUrl || '',
              flowerSelections: (Array.isArray(data.children)
                ? data.children
                : []
              )
                .filter((c: any) => c?.type === TYPE_PRODUCT.FLOWER)
                .map((c: any) => ({
                  childId: c.id,
                  name: c.name,
                  quantity: Number(c.quantity) || 1
                })),
              itemSelections: (Array.isArray(data.children)
                ? data.children
                : []
              )
                .filter((c: any) => c?.type === TYPE_PRODUCT.ITEM)
                .map((c: any) => ({
                  childId: c.id,
                  name: c.name,
                  quantity: Number(c.quantity) || 1
                })),
              categorySelections: (Array.isArray(data.categories)
                ? data.categories
                : []
              ).map((c: any) => ({ childId: c.id, name: c.name, quantity: 1 }))
            });
            setOpenEdit(true);
          }}
        >
          <PencilIcon className="size-4" />
        </Button>
        <DialogContent className="max-h-[90vh] max-w-[800px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="flex flex-col gap-4">
            {/* Loại - chỉ hiển thị, không cho đổi */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1 block text-sm">Tên sản phẩm</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, name: e.target.value }))
                  }
                  placeholder="Tên sản phẩm"
                  required
                />
              </div>
              <div>
                <Label className="mb-1 block text-sm">Loại</Label>
                <Input value={data.type} disabled />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1 block text-sm">Giá (price)</Label>
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
                <Label className="mb-1 block text-sm">Tồn kho (stock)</Label>
                <Input
                  type="number"
                  value={form.stock}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, stock: Number(e.target.value) }))
                  }
                  placeholder="0"
                  required
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
                placeholder="Mô tả sản phẩm"
              />
            </div>

            {/* Danh mục: chỉ hiển thị khi là FLOWER/ITEM */}
            {(data.type === TYPE_PRODUCT.FLOWER ||
              data.type === TYPE_PRODUCT.ITEM) && (
              <div>
                <Label className="mb-1 block text-sm">Danh mục</Label>
                <Popover open={openCategory} onOpenChange={setOpenCategory}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCategory}
                      className="w-full justify-between"
                    >
                      {form.categorySelections.length > 0
                        ? `${form.categorySelections.length} danh mục đã chọn`
                        : 'Chọn danh mục...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Tìm danh mục..." />
                      <CommandList>
                        <CommandEmpty>Không tìm thấy danh mục.</CommandEmpty>
                        <CommandGroup>
                          {categories.map((cat: any) => {
                            const selected = form.categorySelections.some(
                              (s: any) => s.childId === cat.id
                            );
                            return (
                              <CommandItem
                                key={cat.id}
                                value={cat.name}
                                onSelect={() => {
                                  setForm((prev) => {
                                    const isSel = prev.categorySelections.some(
                                      (s: any) => s.childId === cat.id
                                    );
                                    return {
                                      ...prev,
                                      categorySelections: isSel
                                        ? prev.categorySelections.filter(
                                            (s: any) => s.childId !== cat.id
                                          )
                                        : [
                                            ...prev.categorySelections,
                                            {
                                              childId: cat.id,
                                              name: cat.name,
                                              quantity: 1
                                            }
                                          ]
                                    };
                                  });
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    selected ? 'opacity-100' : 'opacity-0'
                                  )}
                                />
                                {cat.name}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {form.categorySelections.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    {form.categorySelections.map((c: any) => (
                      <div key={c.childId} className="flex items-center gap-2">
                        <span>{c.name}</span>
                        <Input
                          type="number"
                          className="h-7 w-16 px-2 py-1 text-xs"
                          value={c.quantity}
                          min={1}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setForm((prev) => ({
                              ...prev,
                              categorySelections: prev.categorySelections.map(
                                (it: any) =>
                                  it.childId === c.childId
                                    ? { ...it, quantity: val }
                                    : it
                              )
                            }));
                          }}
                          placeholder="Số lượng"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="ml-2 h-5 w-5 text-xs"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              categorySelections:
                                prev.categorySelections.filter(
                                  (it: any) => it.childId !== c.childId
                                )
                            }))
                          }
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Thành phần: chỉ hiển thị khi là PRODUCT */}
            {data.type === TYPE_PRODUCT.PRODUCT && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1 block text-sm">Hoa</Label>
                  <Popover open={openFlower} onOpenChange={setOpenFlower}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openFlower}
                        className="w-full justify-between"
                      >
                        {form.flowerSelections.length > 0
                          ? `${form.flowerSelections.length} hoa đã chọn`
                          : 'Chọn hoa...'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Tìm hoa..." />
                        <CommandList>
                          <CommandEmpty>Không tìm thấy hoa.</CommandEmpty>
                          <CommandGroup>
                            {flowers.map((flower: any) => {
                              const selected = form.flowerSelections.some(
                                (s: any) => s.childId === flower.id
                              );
                              return (
                                <CommandItem
                                  key={flower.id}
                                  value={flower.name}
                                  onSelect={() => {
                                    setForm((prev) => {
                                      const isSel = prev.flowerSelections.some(
                                        (s: any) => s.childId === flower.id
                                      );
                                      return {
                                        ...prev,
                                        flowerSelections: isSel
                                          ? prev.flowerSelections.filter(
                                              (s: any) =>
                                                s.childId !== flower.id
                                            )
                                          : [
                                              ...prev.flowerSelections,
                                              {
                                                childId: flower.id,
                                                name: flower.name,
                                                quantity: 1
                                              }
                                            ]
                                      };
                                    });
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      selected ? 'opacity-100' : 'opacity-0'
                                    )}
                                  />
                                  {flower.name}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {form.flowerSelections.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      {form.flowerSelections.map((f: any) => (
                        <div
                          key={f.childId}
                          className="flex items-center gap-2"
                        >
                          <span>{f.name}</span>
                          <Input
                            type="number"
                            className="h-7 w-16 px-2 py-1 text-xs"
                            value={f.quantity}
                            min={1}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setForm((prev) => ({
                                ...prev,
                                flowerSelections: prev.flowerSelections.map(
                                  (it: any) =>
                                    it.childId === f.childId
                                      ? { ...it, quantity: val }
                                      : it
                                )
                              }));
                            }}
                            placeholder="Số lượng"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="ml-2 h-5 w-5 text-xs"
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                flowerSelections: prev.flowerSelections.filter(
                                  (it: any) => it.childId !== f.childId
                                )
                              }))
                            }
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <Label className="mb-1 block text-sm">Items</Label>
                  <Popover open={openItem} onOpenChange={setOpenItem}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openItem}
                        className="w-full justify-between"
                      >
                        {form.itemSelections.length > 0
                          ? `${form.itemSelections.length} items đã chọn`
                          : 'Chọn items...'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Tìm items..." />
                        <CommandList>
                          <CommandEmpty>Không tìm thấy items.</CommandEmpty>
                          <CommandGroup>
                            {items.map((item: any) => {
                              const selected = form.itemSelections.some(
                                (s: any) => s.childId === item.id
                              );
                              return (
                                <CommandItem
                                  key={item.id}
                                  value={item.name}
                                  onSelect={() => {
                                    setForm((prev) => {
                                      const isSel = prev.itemSelections.some(
                                        (s: any) => s.childId === item.id
                                      );
                                      return {
                                        ...prev,
                                        itemSelections: isSel
                                          ? prev.itemSelections.filter(
                                              (s: any) => s.childId !== item.id
                                            )
                                          : [
                                              ...prev.itemSelections,
                                              {
                                                childId: item.id,
                                                name: item.name,
                                                quantity: 1
                                              }
                                            ]
                                      };
                                    });
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      selected ? 'opacity-100' : 'opacity-0'
                                    )}
                                  />
                                  {item.name}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {form.itemSelections.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      {form.itemSelections.map((it: any) => (
                        <div
                          key={it.childId}
                          className="flex items-center gap-2"
                        >
                          <span>{it.name}</span>
                          <Input
                            type="number"
                            className="h-7 w-16 px-2 py-1 text-xs"
                            value={it.quantity}
                            min={1}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setForm((prev) => ({
                                ...prev,
                                itemSelections: prev.itemSelections.map(
                                  (x: any) =>
                                    x.childId === it.childId
                                      ? { ...x, quantity: val }
                                      : x
                                )
                              }));
                            }}
                            placeholder="Số lượng"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="ml-2 h-5 w-5 text-xs"
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                itemSelections: prev.itemSelections.filter(
                                  (x: any) => x.childId !== it.childId
                                )
                              }))
                            }
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1 block text-sm">Ảnh chính</Label>
                <Input
                  value={form.mainImageUrl}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, mainImageUrl: e.target.value }))
                  }
                  placeholder="URL ảnh chính"
                />
              </div>
              <div>
                <Label className="mb-1 block text-sm">
                  Ảnh phụ (phân tách bằng dấu phẩy)
                </Label>
                <Input
                  value={(form.imageUrls || []).join(',')}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      imageUrls: e.target.value
                        .split(',')
                        .map((x) => x.trim())
                        .filter(Boolean)
                    }))
                  }
                  placeholder="URL1, URL2, URL3"
                />
              </div>
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
