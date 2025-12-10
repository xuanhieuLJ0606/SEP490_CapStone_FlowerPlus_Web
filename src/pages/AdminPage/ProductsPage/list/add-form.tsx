import React, { useState, useCallback } from 'react';
import { useCreateProduct } from '@/queries/products.query';
import { useGetCategories } from '@/queries/categories.query';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Check,
  ChevronsUpDown,
  Package,
  Flower2,
  Box,
  X,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TYPE_PRODUCT } from './overview';
import { useGetListProductByPaging } from '@/queries/product.query';
import UploadImage from '@/components/shared/upload-image';
import { Switch } from '@/components/ui/switch';

export function AddProductForm() {
  const { mutateAsync: createProduct } = useCreateProduct();
  const { data: resCategories } = useGetCategories(false);
  const categories = resCategories?.data || [];
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
  const flowers = resFlowers?.listObjects || [];
  const items = resItems?.listObjects || [];

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    isActive: true,
    productType: TYPE_PRODUCT.PRODUCT,
    imageUrls: [] as string[],
    flowerSelections: [] as {
      childId: number;
      name: string;
      quantity: number;
    }[],
    itemSelections: [] as { childId: number; name: string; quantity: number }[],
    categorySelections: [] as {
      childId: number;
      name: string;
    }[]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [openFlower, setOpenFlower] = useState(false);
  const [openItem, setOpenItem] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  const handleTypeChange = (value: any) => {
    setForm((prev) => {
      if (prev.productType === value) return prev;
      return {
        ...prev,
        productType: value,
        categorySelections:
          value === TYPE_PRODUCT.PRODUCT ? [] : prev.categorySelections
      };
    });
  };

  const handleImageUrlsChange = useCallback((urls: string | string[]) => {
    setForm((s) => ({
      ...s,
      imageUrls: Array.isArray(urls) ? urls : [urls]
    }));
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!form.name.trim()) {
      setError('Vui lòng nhập tên sản phẩm');
      return;
    }
    if (form.name.length > 255) {
      setError('Tên sản phẩm không được vượt quá 255 ký tự');
      return;
    }
    if (form.price < 0) {
      setError('Giá sản phẩm không được âm');
      return;
    }
    if (form.price === 0) {
      setError('Vui lòng nhập giá sản phẩm');
      return;
    }
    if (form.stock < 0) {
      setError('Số lượng tồn kho không được âm');
      return;
    }
    if (
      (form.productType === TYPE_PRODUCT.FLOWER ||
        form.productType === TYPE_PRODUCT.ITEM) &&
      form.categorySelections.length === 0
    ) {
      setError('Vui lòng chọn ít nhất một danh mục');
      return;
    }
    if (form.productType === TYPE_PRODUCT.PRODUCT) {
      if (
        form.flowerSelections.length === 0 &&
        form.itemSelections.length === 0
      ) {
        setError(
          'Sản phẩm combo phải có ít nhất một thành phần (hoa hoặc item)'
        );
        return;
      }
      const invalidQuantity = [
        ...form.flowerSelections,
        ...form.itemSelections
      ].some((item) => !item.quantity || item.quantity <= 0);
      if (invalidQuantity) {
        setError('Số lượng thành phần phải lớn hơn 0');
        return;
      }
    }
    setLoading(true);

    // const imagesString = form.imageUrls.filter(Boolean).join(',');
    const imagesString = JSON.stringify(form.imageUrls);

    const payload: any = {
      id: 0,
      name: form.name,
      description: form.description,
      stock: Number(form.stock) || 0,
      price: Number(form.price) || 0,
      isActive: form.isActive,
      productType: form.productType,
      images: imagesString
    };

    if (
      form.productType === TYPE_PRODUCT.FLOWER ||
      form.productType === TYPE_PRODUCT.ITEM
    ) {
      payload.categoryIds = form.categorySelections.map((cat) => cat.childId);
    }

    if (form.productType === TYPE_PRODUCT.PRODUCT) {
      payload.compositions = [
        ...form.flowerSelections.map((f) => ({
          childProductId: f.childId,
          quantity: Number(f.quantity) || 1
        })),
        ...form.itemSelections.map((i) => ({
          childProductId: i.childId,
          quantity: Number(i.quantity) || 1
        }))
      ];
    }

    try {
      const [err] = await createProduct(payload);
      if (err) {
        setError(err.message || 'Thao tác thất bại');
        return;
      }
      setSuccess(true);
      setForm({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        isActive: true,
        productType: TYPE_PRODUCT.PRODUCT,
        imageUrls: [],
        flowerSelections: [],
        itemSelections: [],
        categorySelections: []
      });
    } catch (err) {
      setError('Thao tác thất bại');
    } finally {
      setLoading(false);
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

  const toType = (v: string) =>
    v as unknown as (typeof TYPE_PRODUCT)[keyof typeof TYPE_PRODUCT];

  const getTypeIcon = (type: any) => {
    if (type === TYPE_PRODUCT.FLOWER) return <Flower2 className="h-4 w-4" />;
    if (type === TYPE_PRODUCT.ITEM) return <Box className="h-4 w-4" />;
    return <Package className="h-4 w-4" />;
  };

  const getTypeColor = (type: any) => {
    if (type === TYPE_PRODUCT.FLOWER) return 'from-pink-500 to-rose-500';
    if (type === TYPE_PRODUCT.ITEM) return 'from-amber-500 to-orange-500';
    return 'from-blue-500 to-indigo-500';
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-7xl">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
        {/* Header with gradient */}
        <div
          className={cn(
            'bg-gradient-to-r px-8 py-6',
            getTypeColor(form.productType)
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              {getTypeIcon(form.productType)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Thêm Sản Phẩm Mới
              </h2>
              <p className="text-sm text-white/90">
                Điền thông tin để tạo sản phẩm
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-[280px_1fr] gap-0">
            {/* Sidebar - Type selector */}
            <div className="border-r border-gray-200 bg-gray-50 p-6">
              <Label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                Loại sản phẩm
              </Label>
              <Tabs
                value={String(form.productType)}
                onValueChange={(v) => handleTypeChange(toType(v))}
                className="w-full"
              >
                <TabsList className="flex h-auto flex-col items-stretch justify-start gap-2 bg-transparent p-0">
                  <TabsTrigger
                    value={String(TYPE_PRODUCT.PRODUCT)}
                    className="group w-full justify-start gap-3 rounded-lg border-2 border-transparent bg-white px-4 py-3 shadow-sm transition-all hover:border-blue-200 hover:shadow-md data-[state=active]:border-blue-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
                  >
                    <Package className="h-4 w-4" />
                    <span className="font-medium">Product</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value={String(TYPE_PRODUCT.FLOWER)}
                    className="group w-full justify-start gap-3 rounded-lg border-2 border-transparent bg-white px-4 py-3 shadow-sm transition-all hover:border-pink-200 hover:shadow-md data-[state=active]:border-pink-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
                  >
                    <Flower2 className="h-4 w-4" />
                    <span className="font-medium">Flower</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value={String(TYPE_PRODUCT.ITEM)}
                    className="group w-full justify-start gap-3 rounded-lg border-2 border-transparent bg-white px-4 py-3 shadow-sm transition-all hover:border-amber-200 hover:shadow-md data-[state=active]:border-amber-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
                  >
                    <Box className="h-4 w-4" />
                    <span className="font-medium">Item</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Main content */}
            <div className="space-y-6 p-8">
              {/* Basic Info Section */}
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    Tên sản phẩm
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, name: e.target.value }))
                    }
                    placeholder="Nhập tên sản phẩm"
                    required
                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                      Giá (VNĐ)
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm((s) => ({
                          ...s,
                          price: Number(e.target.value)
                        }))
                      }
                      placeholder="0"
                      required
                      min={0}
                      className="h-11 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                      Tồn kho
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      value={form.stock}
                      onChange={(e) =>
                        setForm((s) => ({
                          ...s,
                          stock: Number(e.target.value)
                        }))
                      }
                      placeholder="0"
                      required
                      min={0}
                      className="h-11 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block text-sm font-semibold text-gray-700">
                    Mô tả
                  </Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, description: e.target.value }))
                    }
                    placeholder="Nhập mô tả chi tiết về sản phẩm..."
                    rows={4}
                    className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="flex items-center gap-3 rounded-lg border-2 border-gray-200 bg-gray-50 p-4 transition-colors hover:border-gray-300">
                  <Switch
                    id="isActive"
                    checked={form.isActive}
                    onCheckedChange={(checked) =>
                      setForm((s) => ({ ...s, isActive: checked }))
                    }
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="isActive"
                      className="cursor-pointer font-medium text-gray-900"
                    >
                      Sản phẩm đang hoạt động
                    </Label>
                    <p className="text-xs text-gray-500">
                      Sản phẩm sẽ hiển thị trên website
                    </p>
                  </div>
                </div>
              </div>

              {/* Category Selector */}
              {(form.productType === TYPE_PRODUCT.FLOWER ||
                form.productType === TYPE_PRODUCT.ITEM) && (
                <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-5">
                  <Label className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    Danh mục
                    <span className="text-red-500">*</span>
                  </Label>
                  <Popover open={openCategory} onOpenChange={setOpenCategory}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCategory}
                        className="h-11 w-full justify-between border-gray-300 bg-white hover:border-blue-500 hover:bg-blue-50"
                      >
                        {form.categorySelections.length > 0
                          ? `${form.categorySelections.length} danh mục đã chọn`
                          : 'Chọn danh mục...'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Tìm danh mục..." />
                        <CommandList>
                          <CommandEmpty>Không tìm thấy danh mục.</CommandEmpty>
                          <CommandGroup>
                            {categories.map((cat: any) => (
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
                                    form.categorySelections.some(
                                      (s) => s.childId === cat.id
                                    )
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                                {cat.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {form.categorySelections.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {form.categorySelections.map((c) => (
                        <div
                          key={c.childId}
                          className="group flex items-center gap-2 rounded-md bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-900 transition-colors hover:bg-blue-200"
                        >
                          <span>{c.name}</span>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-5 w-5 rounded-full p-0 text-blue-700 hover:bg-blue-300 hover:text-blue-900"
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

              {/* Compositions */}
              {form.productType === TYPE_PRODUCT.PRODUCT && (
                <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-5">
                  <Label className="mb-4 block text-sm font-semibold text-gray-700">
                    Thành phần sản phẩm
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Flower Selector */}
                    <div>
                      <Label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                        <Flower2 className="h-3.5 w-3.5" />
                        Hoa
                      </Label>
                      <Popover open={openFlower} onOpenChange={setOpenFlower}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openFlower}
                            className="h-11 w-full justify-between border-gray-300 bg-white hover:border-pink-500 hover:bg-pink-50"
                          >
                            {form.flowerSelections.length > 0
                              ? `${form.flowerSelections.length} hoa`
                              : 'Chọn hoa...'}
                            <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Tìm hoa..." />
                            <CommandList>
                              <CommandEmpty>Không tìm thấy hoa.</CommandEmpty>
                              <CommandGroup>
                                {flowers.map((flower: any) => (
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
                                        form.flowerSelections.some(
                                          (s) => s.childId === flower.id
                                        )
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {flower.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {form.flowerSelections.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {form.flowerSelections.map((f) => (
                            <div
                              key={f.childId}
                              className="flex items-center gap-2 rounded-lg border border-pink-200 bg-pink-50 p-2.5 transition-colors hover:border-pink-300"
                            >
                              <span className="flex-1 text-sm font-medium text-gray-900">
                                {f.name}
                              </span>
                              <Input
                                type="number"
                                className="h-9 w-20 border-pink-300 bg-white text-center focus:border-pink-500"
                                value={f.quantity}
                                min={1}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    'flower',
                                    f.childId,
                                    Number(e.target.value)
                                  )
                                }
                                placeholder="SL"
                              />
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 rounded-full text-pink-700 hover:bg-pink-200 hover:text-pink-900"
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

                    {/* Item Selector */}
                    <div>
                      <Label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                        <Box className="h-3.5 w-3.5" />
                        Items
                      </Label>
                      <Popover open={openItem} onOpenChange={setOpenItem}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openItem}
                            className="h-11 w-full justify-between border-gray-300 bg-white hover:border-amber-500 hover:bg-amber-50"
                          >
                            {form.itemSelections.length > 0
                              ? `${form.itemSelections.length} items`
                              : 'Chọn items...'}
                            <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Tìm items..." />
                            <CommandList>
                              <CommandEmpty>Không tìm thấy items.</CommandEmpty>
                              <CommandGroup>
                                {items.map((item: any) => (
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
                                        form.itemSelections.some(
                                          (s) => s.childId === item.id
                                        )
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {item.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {form.itemSelections.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {form.itemSelections.map((it) => (
                            <div
                              key={it.childId}
                              className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 transition-colors hover:border-amber-300"
                            >
                              <span className="flex-1 text-sm font-medium text-gray-900">
                                {it.name}
                              </span>
                              <Input
                                type="number"
                                className="h-9 w-20 border-amber-300 bg-white text-center focus:border-amber-500"
                                value={it.quantity}
                                min={1}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    'item',
                                    it.childId,
                                    Number(e.target.value)
                                  )
                                }
                                placeholder="SL"
                              />
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 rounded-full text-amber-700 hover:bg-amber-200 hover:text-amber-900"
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
                </div>
              )}

              {/* Images Upload */}
              <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-5">
                <Label className="mb-3 block text-sm font-semibold text-gray-700">
                  Ảnh sản phẩm
                </Label>
                <UploadImage
                  multiple
                  maxFiles={8}
                  onChange={handleImageUrlsChange}
                  defaultValue={form.imageUrls}
                />
              </div>

              {/* Messages */}
              {error && (
                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <X className="h-3 w-3 text-red-600" />
                  </div>
                  <p className="text-sm font-medium text-red-900">{error}</p>
                </div>
              )}
              {success && (
                <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-green-900">
                    Tạo sản phẩm thành công!
                  </p>
                </div>
              )}

              {/* Submit button */}
              <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="min-w-24"
                  onClick={() => window.history.back()}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    'min-w-32 bg-gradient-to-r font-semibold shadow-lg transition-all hover:shadow-xl disabled:opacity-50',
                    getTypeColor(form.productType)
                  )}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Đang lưu...
                    </span>
                  ) : (
                    'Lưu sản phẩm'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
