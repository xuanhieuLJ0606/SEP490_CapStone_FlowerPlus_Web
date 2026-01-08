import { Button } from '@/components/ui/button';
import { useUpdateProduct, useDeleteProduct } from '@/queries/products.query';
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
import { Check, ChevronsUpDown, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import UploadImage from '@/components/shared/upload-image';

interface CellActionProps {
  data: any;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const { mutateAsync: deleteProduct } = useDeleteProduct();
  const { data: resCategories } = useGetCategories(false);
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
  const flowers = resFlowers?.listObjects || [];
  const items = resItems?.listObjects || [];

  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openFlower, setOpenFlower] = useState(false);
  const [openItem, setOpenItem] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  const parseImages = (images: any) => {
    if (typeof images === 'string') {
      try {
        return JSON.parse(images);
      } catch {
        return [];
      }
    }
    return Array.isArray(images) ? images : [];
  };

  const [form, setForm] = useState({
    name: data.name || '',
    description: data.description || '',
    price: Number(data.price) || 0,
    stock: Number(data.stock) || 0,
    isActive: Boolean(data.isActive ?? true),
    productType: data.productType as string,
    imageUrls: parseImages(data.images),
    flowerSelections: (Array.isArray(data.compositions)
      ? data.compositions
      : []
    )
      .filter((c: any) => c?.childType === TYPE_PRODUCT.FLOWER)
      .map((c: any) => ({
        childId: c.childId,
        name: c.childName,
        quantity: Number(c.quantity) || 1
      })),
    itemSelections: (Array.isArray(data.compositions) ? data.compositions : [])
      .filter((c: any) => c?.childType === TYPE_PRODUCT.ITEM)
      .map((c: any) => ({
        childId: c.childId,
        name: c.childName,
        quantity: Number(c.quantity) || 1
      })),
    categorySelections: (Array.isArray(data.categories)
      ? data.categories
      : []
    ).map((c: any) => ({ childId: c.id, name: c.name }))
  });

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập tên sản phẩm',
        variant: 'destructive'
      });
      return;
    }
    if (form.name.length > 255) {
      toast({
        title: 'Lỗi',
        description: 'Tên sản phẩm không được vượt quá 255 ký tự',
        variant: 'destructive'
      });
      return;
    }
    if (form.price < 0) {
      toast({
        title: 'Lỗi',
        description: 'Giá sản phẩm không được âm',
        variant: 'destructive'
      });
      return;
    }
    if (form.price === 0) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập giá sản phẩm',
        variant: 'destructive'
      });
      return;
    }
    if (form.stock < 0) {
      toast({
        title: 'Lỗi',
        description: 'Số lượng tồn kho không được âm',
        variant: 'destructive'
      });
      return;
    }
    if (
      (data.productType === TYPE_PRODUCT.FLOWER ||
        data.productType === TYPE_PRODUCT.ITEM) &&
      form.categorySelections.length === 0
    ) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn ít nhất một danh mục',
        variant: 'destructive'
      });
      return;
    }
    if (data.productType === TYPE_PRODUCT.PRODUCT) {
      if (
        form.flowerSelections.length === 0 &&
        form.itemSelections.length === 0
      ) {
        toast({
          title: 'Lỗi',
          description: 'Sản phẩm combo phải có ít nhất một thành phần',
          variant: 'destructive'
        });
        return;
      }
      const invalidQuantity = [
        ...form.flowerSelections,
        ...form.itemSelections
      ].some((item) => !item.quantity || item.quantity <= 0);
      if (invalidQuantity) {
        toast({
          title: 'Lỗi',
          description: 'Số lượng thành phần phải lớn hơn 0',
          variant: 'destructive'
        });
        return;
      }
    }

    const imagesString = JSON.stringify(form.imageUrls);

    const payload: any = {
      id: data.id,
      name: form.name,
      description: form.description,
      stock: Number(form.stock) || 0,
      price: Number(form.price) || 0,
      isActive: form.isActive,
      productType: data.productType,
      images: imagesString
    };

    if (
      data.productType === TYPE_PRODUCT.FLOWER ||
      data.productType === TYPE_PRODUCT.ITEM
    ) {
      payload.categoryIds = (form.categorySelections || []).map(
        (c: any) => c.childId
      );
    }
    if (data.productType === TYPE_PRODUCT.PRODUCT) {
      payload.compositions = [
        ...form.flowerSelections.map((f: any) => ({
          childProductId: f.childId,
          quantity: Number(f.quantity) || 1
        })),
        ...form.itemSelections.map((i: any) => ({
          childProductId: i.childId,
          quantity: Number(i.quantity) || 1
        }))
      ];
    }

    try {
      const [err] = await updateProduct(payload as any);
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

  const handleDelete = async () => {
    try {
      const [err] = await deleteProduct(data.id);
      if (err) {
        toast({
          title: 'Thất bại',
          description:
            err.message ||
            'Xóa thất bại, có lỗi phát sinh hoặc do sản phẩm đang xóa dính đến sản phẩm khác đang hoạt động',
          variant: 'destructive'
        });
        return;
      }
      toast({
        title: 'Thành công',
        description: 'Xóa product thành công',
        variant: 'default'
      });
      setOpenDelete(false);
    } catch (error: any) {
      toast({
        title: 'Thất bại',
        description:
          error?.message ||
          'Xóa thất bại, có lỗi phát sinh hoặc do sản phẩm đang xóa dính đến sản phẩm khác đang hoạt động',
        variant: 'destructive'
      });
    }
  };

  const handleSelect = (
    type: 'flower' | 'item' | 'category',
    option: { id: number; name: string }
  ) => {
    setForm((prev) => {
      const key =
        type === 'flower'
          ? 'flowerSelections'
          : type === 'item'
            ? 'itemSelections'
            : 'categorySelections';
      const selections = prev[key as keyof typeof prev] as {
        childId: number;
        name: string;
        quantity?: number;
      }[];
      const isSelected = selections.some((s) => s.childId === option.id);
      if (isSelected) {
        return {
          ...prev,
          [key]: selections.filter((s) => s.childId !== option.id)
        };
      }
      const newItem =
        type === 'category'
          ? {
              childId: option.id,
              name: option.name
            }
          : {
              childId: option.id,
              name: option.name,
              quantity: 1
            };
      return {
        ...prev,
        [key]: [...selections, newItem]
      };
    });
  };

  const handleQuantityChange = (
    type: 'flower' | 'item',
    childId: number,
    value: number
  ) => {
    setForm((prev) => {
      const selections =
        type === 'flower' ? prev.flowerSelections : prev.itemSelections;
      const updatedSelections = selections.map((item) =>
        item.childId === childId ? { ...item, quantity: value } : item
      );
      return {
        ...prev,
        [`${type}Selections`]: updatedSelections
      };
    });
  };

  const handleImageUrlsChange = (urls: string | string[]) => {
    setForm((s) => ({
      ...s,
      imageUrls: Array.isArray(urls) ? urls : [urls]
    }));
  };

  return (
    <div className="flex items-center gap-2">
      {/* Sync button */}

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
              isActive: Boolean(data.isActive ?? true),
              productType: data.productType,
              imageUrls: parseImages(data.images),
              flowerSelections: (Array.isArray(data.compositions)
                ? data.compositions
                : []
              )
                .filter((c: any) => c?.childType === TYPE_PRODUCT.FLOWER)
                .map((c: any) => ({
                  childId: c.childId,
                  name: c.childName,
                  quantity: Number(c.quantity) || 1
                })),
              itemSelections: (Array.isArray(data.compositions)
                ? data.compositions
                : []
              )
                .filter((c: any) => c?.childType === TYPE_PRODUCT.ITEM)
                .map((c: any) => ({
                  childId: c.childId,
                  name: c.childName,
                  quantity: Number(c.quantity) || 1
                })),
              categorySelections: (Array.isArray(data.categories)
                ? data.categories
                : []
              ).map((c: any) => ({ childId: c.id, name: c.name }))
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
                <Input value={data.productType} disabled />
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
                rows={6}
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="isActive"
                checked={form.isActive}
                onCheckedChange={(checked) =>
                  setForm((s) => ({ ...s, isActive: checked }))
                }
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Sản phẩm đang hoạt động
              </Label>
            </div>

            {(data.productType === TYPE_PRODUCT.FLOWER ||
              data.productType === TYPE_PRODUCT.ITEM) && (
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
                                onSelect={() =>
                                  handleSelect('category', {
                                    id: cat.id,
                                    name: cat.name
                                  })
                                }
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
                  <div className="mt-2 flex flex-wrap gap-2">
                    {form.categorySelections.map((c: any) => (
                      <div
                        key={c.childId}
                        className="flex items-center gap-2 rounded-md bg-blue-100 px-3 py-1.5 text-sm"
                      >
                        <span>{c.name}</span>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-5 w-5 rounded-full p-0"
                          onClick={() =>
                            handleSelect('category', {
                              id: c.childId,
                              name: c.name
                            })
                          }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {data.productType === TYPE_PRODUCT.PRODUCT && (
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
                          ? `${form.flowerSelections.length} hoa`
                          : 'Chọn hoa...'}
                        <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                                  onSelect={() =>
                                    handleSelect('flower', {
                                      id: flower.id,
                                      name: flower.name
                                    })
                                  }
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
                    <div className="mt-2 space-y-2">
                      {form.flowerSelections.map((f: any) => (
                        <div
                          key={f.childId}
                          className="flex items-center gap-2 rounded-lg border border-pink-200 bg-pink-50 p-2"
                        >
                          <span className="flex-1 text-sm">{f.name}</span>
                          <Input
                            type="number"
                            className="h-8 w-20 text-center"
                            value={f.quantity}
                            min={1}
                            onChange={(e) =>
                              handleQuantityChange(
                                'flower',
                                f.childId,
                                Number(e.target.value)
                              )
                            }
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() =>
                              handleSelect('flower', {
                                id: f.childId,
                                name: f.name
                              })
                            }
                          >
                            <X className="h-4 w-4" />
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
                          ? `${form.itemSelections.length} items`
                          : 'Chọn items...'}
                        <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                                  onSelect={() =>
                                    handleSelect('item', {
                                      id: item.id,
                                      name: item.name
                                    })
                                  }
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
                    <div className="mt-2 space-y-2">
                      {form.itemSelections.map((it: any) => (
                        <div
                          key={it.childId}
                          className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2"
                        >
                          <span className="flex-1 text-sm">{it.name}</span>
                          <Input
                            type="number"
                            className="h-8 w-20 text-center"
                            value={it.quantity}
                            min={1}
                            onChange={(e) =>
                              handleQuantityChange(
                                'item',
                                it.childId,
                                Number(e.target.value)
                              )
                            }
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() =>
                              handleSelect('item', {
                                id: it.childId,
                                name: it.name
                              })
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <Label className="mb-1 block text-sm">Ảnh sản phẩm</Label>
              <UploadImage
                multiple
                maxFiles={8}
                onChange={handleImageUrlsChange}
                defaultValue={form.imageUrls}
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
              Bạn có chắc chắn muốn xóa sản phẩm "{data.name}"? Hành động này
              không thể hoàn tác.
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
