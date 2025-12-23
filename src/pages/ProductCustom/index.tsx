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
import {
  Check,
  ChevronsUpDown,
  Package,
  Flower2,
  Box,
  X,
  Plus,
  ShoppingCart,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Heart,
  List,
  MapPin,
  Phone,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TYPE_PRODUCT } from '@/pages/AdminPage/ProductsPage/list/overview';
import {
  useGetListProductByPaging,
  useGetProductCustomByPaging
} from '@/queries/product.query';
import UploadImage from '@/components/shared/upload-image';
import { useCheckoutProductCustom } from '@/queries/order.query';
import { toast } from '@/components/ui/use-toast';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';

type TabType = 'create' | 'existing';

export default function ProductCustomImproved() {
  const { mutateAsync: createProduct } = useCreateProduct();
  const { data: resCategories } = useGetCategories();
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
  const { data: resProductCustom } = useGetProductCustomByPaging(1, 50);
  const productCustom = resProductCustom?.listObjects || [];
  const { infoUser } = useSelector((state: RootState) => state.auth);
  const deliveryAddresses = infoUser?.deliveryAddresses || [];

  // Tab management
  const [activeTab, setActiveTab] = useState<TabType>('create');
  const [selectedExistingProduct, setSelectedExistingProduct] =
    useState<any>(null);

  // Step management
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [createdProduct, setCreatedProduct] = useState<any>(null);

  // Form states for Create Product
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
      images?: string[];
    }[],
    itemSelections: [] as {
      childId: number;
      name: string;
      quantity: number;
      images?: string[];
    }[],
    categorySelections: [] as {
      childId: number;
      name: string;
    }[]
  });

  // Form states for Order
  const [orderForm, setOrderForm] = useState({
    userId: 0,
    shippingAddress: '',
    phoneNumber: '',
    returnUrl: '',
    requestDeliveryTime: '',
    cancelUrl: '',
    note: '',
    quantity: 1
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [openFlower, setOpenFlower] = useState(false);
  const [openItem, setOpenItem] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openAddress, setOpenAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const { mutateAsync: checkoutProduct } = useCheckoutProductCustom();

  const parseImages = (imagesString: string): string[] => {
    try {
      return JSON.parse(imagesString);
    } catch {
      return [];
    }
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

  const handleSelectAddress = (address: any) => {
    setSelectedAddressId(address.id);
    setOrderForm((prev) => ({
      ...prev,
      shippingAddress: address.address,
      phoneNumber: address.phoneNumber
    }));
    setOpenAddress(false);
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!form.name.trim()) {
      setError('Vui lòng nhập tên sản phẩm');
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
    setLoading(true);

    const imagesString = JSON.stringify(form.imageUrls);

    const payload: any = {
      id: 0,
      name: form.name,
      description: form.description,
      stock: Number(form.stock) || 0,
      price: Number(form.price) || 0,
      requestDeliveryTime: orderForm.requestDeliveryTime || null,
      isActive: true,
      custom: true,
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
      const [err, data] = await createProduct(payload);
      if (err) {
        setError(err.message || 'Thao tác thất bại');
        return;
      }

      setCreatedProduct(data);
      setOrderForm((prev) => ({
        ...prev,
        productId: data?.id || 0
      }));
      setSuccess(true);

      setTimeout(() => {
        setCurrentStep(2);
        setSuccess(false);
      }, 1);
    } catch (err) {
      setError('Thao tác thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!orderForm.shippingAddress.trim()) {
      setError('Vui lòng nhập địa chỉ giao hàng');
      return;
    }
    if (!orderForm.phoneNumber.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return;
    }
    if (!orderForm.requestDeliveryTime.trim()) {
      setError('Vui lòng chọn thời gian giao hàng mong muốn');
      return;
    }

    // Validate thời gian giao hàng phải lớn hơn thời gian hiện tại
    const selectedDateTime = new Date(orderForm.requestDeliveryTime);
    const now = new Date();
    if (selectedDateTime <= now) {
      setError('Thời gian giao hàng phải lớn hơn thời gian hiện tại');
      return;
    }

    setLoading(true);

    const productId = selectedExistingProduct?.id || createdProduct?.id || 0;

    const payload = {
      userId: orderForm.userId,
      productId: productId,
      shippingAddress: orderForm.shippingAddress,
      phoneNumber: orderForm.phoneNumber,
      returnUrl: orderForm.returnUrl || 'string',
      cancelUrl: orderForm.cancelUrl || 'string',
      note: orderForm.note,
      voucherCode: null,
      quantity: Number(orderForm.quantity) || 1,
      requestDeliveryTime: orderForm.requestDeliveryTime || null
    };

    const [err] = await checkoutProduct(payload);
    if (err) {
      setError(err.message || 'Thao tác thất bại');
      setLoading(false);
      return;
    }

    toast({
      title: 'Đặt hàng thành công',
      description:
        'Đặt hàng thành công, vui lòng chờ shop duyệt để hoàn tất đơn hàng',
      variant: 'success'
    });

    // Reset all states
    setCurrentStep(1);
    setCreatedProduct(null);
    setSelectedExistingProduct(null);
    setActiveTab('create');
    setSelectedAddressId(null);
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
    setOrderForm({
      userId: 0,
      shippingAddress: '',
      phoneNumber: '',
      returnUrl: '',
      requestDeliveryTime: '',
      cancelUrl: '',
      note: '',
      quantity: 1
    });
    setSuccess(false);
    setLoading(false);
  };

  const handleSelect = (
    type: 'flower' | 'item' | 'category',
    option: { id: number; name: string; images?: string }
  ) => {
    setForm((prev) => {
      const key =
        type === 'flower'
          ? 'flowerSelections'
          : type === 'item'
            ? 'itemSelections'
            : 'categorySelections';
      const selections = prev[key as keyof typeof prev] as any[];
      const isSelected = selections.some((s) => s.childId === option.id);

      if (isSelected) {
        return {
          ...prev,
          [key]: selections.filter((s) => s.childId !== option.id)
        };
      }

      const newItem: any =
        type === 'category'
          ? {
              childId: option.id,
              name: option.name
            }
          : {
              childId: option.id,
              name: option.name,
              quantity: 1,
              images: option.images ? parseImages(option.images) : []
            };
      return {
        ...prev,
        [key]: [...selections, newItem]
      };
    });
  };

  const handleSelectExistingProduct = (product: any) => {
    setSelectedExistingProduct(product);
    setCurrentStep(2);
  };

  const getTypeColor = (type: any) => {
    if (type === TYPE_PRODUCT.FLOWER) return 'from-rose-500 to-pink-500';
    if (type === TYPE_PRODUCT.ITEM) return 'from-pink-500 to-rose-400';
    return 'from-rose-600 to-pink-600';
  };

  const calculateTotalPrice = (product: any) => {
    if (!product.compositions || product.compositions.length === 0) {
      return 0;
    }
    return product.compositions.reduce((total: number, comp: any) => {
      return total + comp.childPrice * comp.quantity;
    }, 0);
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-7xl px-4">
      <div className="flex gap-6">
        {/* Left Sidebar - 30% */}
        <div className="w-[30%]">
          <div className="sticky top-8 overflow-hidden rounded-xl border border-rose-100 bg-white shadow-lg">
            {/* Sidebar Header */}
            <div className="bg-gradient-to-br from-rose-500 to-pink-500 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Tùy Chỉnh Hoa
                  </h3>
                  <p className="text-sm text-white/90">Chọn hoặc tạo mới</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-rose-100 bg-rose-50/50">
              <div className="flex">
                <button
                  onClick={() => {
                    setActiveTab('create');
                    setCurrentStep(1);
                    setSelectedExistingProduct(null);
                  }}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-all',
                    activeTab === 'create'
                      ? 'border-rose-500 bg-white text-rose-700'
                      : 'border-transparent text-gray-600 hover:bg-rose-50 hover:text-rose-600'
                  )}
                >
                  <Plus className="h-4 w-4" />
                  Tạo Mới
                </button>
                <button
                  onClick={() => {
                    setActiveTab('existing');
                    setCurrentStep(1);
                    setCreatedProduct(null);
                  }}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-all',
                    activeTab === 'existing'
                      ? 'border-rose-500 bg-white text-rose-700'
                      : 'border-transparent text-gray-600 hover:bg-rose-50 hover:text-rose-600'
                  )}
                >
                  <List className="h-4 w-4" />
                  Có Sẵn
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {activeTab === 'create' ? (
                <div className="space-y-3">
                  <div className="rounded-lg border border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Heart className="h-4 w-4 text-rose-500" />
                      <h4 className="font-semibold text-gray-900">
                        Tạo hoa tùy chỉnh
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Tạo một bó hoa độc đáo theo ý muốn của bạn với các loại
                      hoa và phụ kiện bạn chọn.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                      <span>Chọn loại hoa yêu thích</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                      <span>Thêm phụ kiện trang trí</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                      <span>Upload ảnh mẫu mong muốn</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {productCustom.length === 0 ? (
                    <div className="rounded-lg border-2 border-dashed border-rose-200 bg-rose-50/30 p-6 text-center">
                      <Flower2 className="mx-auto h-12 w-12 text-rose-300" />
                      <p className="mt-2 text-sm font-medium text-gray-600">
                        Chưa có sản phẩm nào
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Tạo sản phẩm mới để bắt đầu
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {productCustom.length} Sản phẩm có sẵn
                      </p>
                      <div className="max-h-[600px] space-y-2 overflow-y-auto pr-1">
                        {productCustom.map((product: any) => {
                          const productImages = parseImages(
                            product.images || '[]'
                          );
                          const firstImage =
                            productImages[0] ||
                            'https://via.placeholder.com/80?text=Hoa';
                          const totalPrice = calculateTotalPrice(product);

                          return (
                            <div
                              key={product.id}
                              className="group cursor-pointer overflow-hidden rounded-lg border border-rose-200 bg-white transition-all hover:border-rose-400 hover:shadow-md"
                              onClick={() =>
                                handleSelectExistingProduct(product)
                              }
                            >
                              <div className="flex gap-3 p-3">
                                <img
                                  src={firstImage}
                                  alt={product.name}
                                  className="h-20 w-20 shrink-0 rounded-md object-cover"
                                />
                                <div className="flex-1 overflow-hidden">
                                  <h5 className="truncate font-semibold text-gray-900 group-hover:text-rose-700">
                                    {product.name}
                                  </h5>
                                  <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                                    {product.description}
                                  </p>
                                  {totalPrice > 0 && (
                                    <p className="mt-2 text-sm font-bold text-rose-600">
                                      {totalPrice.toLocaleString('vi-VN')}đ
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Content - 70% */}
        <div className="flex-1">
          <div className="overflow-hidden rounded-xl border border-rose-100 bg-white shadow-xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-500/80 to-pink-500 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                    {currentStep === 1 ? (
                      <Package className="h-6 w-6 text-white" />
                    ) : (
                      <ShoppingCart className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {currentStep === 1
                        ? activeTab === 'create'
                          ? 'Tạo Hoa Tùy Chỉnh'
                          : 'Chọn Sản Phẩm Có Sẵn'
                        : 'Thông Tin Đặt Hàng'}
                    </h2>
                    <p className="text-sm text-white/90">
                      {currentStep === 1
                        ? activeTab === 'create'
                          ? 'Thiết kế bó hoa theo ý muốn'
                          : 'Chọn từ các mẫu đã tạo trước'
                        : 'Hoàn tất thông tin giao hàng'}
                    </p>
                  </div>
                </div>

                {/* Step indicator */}
                {activeTab === 'create' && (
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all',
                        currentStep === 1
                          ? 'bg-white text-rose-600'
                          : 'bg-white/20 text-white'
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded-full',
                          currentStep === 1
                            ? 'bg-rose-600 text-white'
                            : 'bg-white/30'
                        )}
                      >
                        {currentStep > 1 ? <Check className="h-4 w-4" /> : '1'}
                      </div>
                      <span>Thiết kế</span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-white/60" />
                    <div
                      className={cn(
                        'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all',
                        currentStep === 2
                          ? 'bg-white text-rose-600'
                          : 'bg-white/20 text-white'
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded-full',
                          currentStep === 2
                            ? 'bg-rose-600 text-white'
                            : 'bg-white/30'
                        )}
                      >
                        2
                      </div>
                      <span>Đặt hàng</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8">
              {currentStep === 1 && activeTab === 'create' ? (
                <form onSubmit={handleSubmitProduct} className="space-y-6">
                  {/* Basic Info Section */}
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                        Tên sản phẩm
                        <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        value={form.name}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, name: e.target.value }))
                        }
                        placeholder="Hoa chúc mừng sinh nhật, hoa tặng lễ tết..."
                        required
                        className="h-11 border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block text-sm font-semibold text-gray-700">
                        Mô tả
                      </Label>
                      <Textarea
                        value={form.description}
                        onChange={(e) =>
                          setForm((s) => ({
                            ...s,
                            description: e.target.value
                          }))
                        }
                        placeholder="Mô tả chi tiết về sản phẩm của bạn..."
                        rows={4}
                        className="border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                      />
                    </div>
                  </div>

                  {/* Category Selector */}
                  {(form.productType === TYPE_PRODUCT.FLOWER ||
                    form.productType === TYPE_PRODUCT.ITEM) && (
                    <div className="rounded-lg border-2 border-dashed border-rose-200 bg-rose-50/30 p-5">
                      <Label className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                        Danh mục
                        <span className="text-rose-500">*</span>
                      </Label>
                      <Popover
                        open={openCategory}
                        onOpenChange={setOpenCategory}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openCategory}
                            className="h-11 w-full justify-between border-rose-200 bg-white hover:border-rose-400 hover:bg-rose-50"
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
                              <CommandEmpty>
                                Không tìm thấy danh mục.
                              </CommandEmpty>
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
                              className="group flex items-center gap-2 rounded-md bg-rose-100 px-3 py-1.5 text-sm font-medium text-rose-900 transition-colors hover:bg-rose-200"
                            >
                              <span>{c.name}</span>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-5 w-5 rounded-full p-0 text-rose-700 hover:bg-rose-300 hover:text-rose-900"
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
                    <div className="rounded-lg border-2 border-dashed border-rose-200 bg-rose-50/30 p-5">
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
                          <Popover
                            open={openFlower}
                            onOpenChange={setOpenFlower}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openFlower}
                                className="h-11 w-full justify-between border-rose-200 bg-white hover:border-pink-400 hover:bg-pink-50"
                              >
                                {form.flowerSelections.length > 0
                                  ? `${form.flowerSelections.length} hoa`
                                  : 'Chọn hoa...'}
                                <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-full p-0"
                              align="start"
                            >
                              <Command>
                                <CommandInput placeholder="Tìm hoa..." />
                                <CommandList>
                                  <CommandEmpty>
                                    Không tìm thấy hoa.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {flowers.map((flower: any) => {
                                      const flowerImages = parseImages(
                                        flower.images || '[]'
                                      );
                                      const firstImage =
                                        flowerImages[0] ||
                                        'https://via.placeholder.com/40?text=Hoa';

                                      return (
                                        <CommandItem
                                          key={flower.id}
                                          value={flower.name}
                                          onSelect={() =>
                                            handleSelect('flower', {
                                              id: flower.id,
                                              name: flower.name,
                                              images: flower.images
                                            })
                                          }
                                          className="flex items-center gap-3"
                                        >
                                          <Check
                                            className={cn(
                                              'h-4 w-4',
                                              form.flowerSelections.some(
                                                (s) => s.childId === flower.id
                                              )
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                            )}
                                          />
                                          <img
                                            src={firstImage}
                                            alt={flower.name}
                                            className="h-10 w-10 rounded object-cover"
                                          />
                                          <span>{flower.name}</span>
                                        </CommandItem>
                                      );
                                    })}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          {form.flowerSelections.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {form.flowerSelections.map((f) => {
                                const firstImage =
                                  f.images?.[0] ||
                                  'https://via.placeholder.com/60?text=Hoa';

                                return (
                                  <div
                                    key={f.childId}
                                    className="flex items-center gap-3 rounded-lg border border-pink-200 bg-pink-50 p-2.5 transition-colors hover:border-pink-300"
                                  >
                                    <img
                                      src={firstImage}
                                      alt={f.name}
                                      className="h-12 w-12 rounded object-cover"
                                    />
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
                                          name: f.name,
                                          images: JSON.stringify(f.images)
                                        })
                                      }
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Item Selector */}
                        <div>
                          <Label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                            <Box className="h-3.5 w-3.5" />
                            Phụ kiện
                          </Label>
                          <Popover open={openItem} onOpenChange={setOpenItem}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openItem}
                                className="h-11 w-full justify-between border-rose-200 bg-white hover:border-rose-400 hover:bg-rose-50"
                              >
                                {form.itemSelections.length > 0
                                  ? `${form.itemSelections.length} phụ kiện`
                                  : 'Chọn phụ kiện...'}
                                <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-full p-0"
                              align="start"
                            >
                              <Command>
                                <CommandInput placeholder="Tìm phụ kiện..." />
                                <CommandList>
                                  <CommandEmpty>
                                    Không tìm thấy phụ kiện.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {items.map((item: any) => {
                                      const itemImages = parseImages(
                                        item.images || '[]'
                                      );
                                      const firstImage =
                                        itemImages[0] ||
                                        'https://via.placeholder.com/40?text=Item';

                                      return (
                                        <CommandItem
                                          key={item.id}
                                          value={item.name}
                                          onSelect={() =>
                                            handleSelect('item', {
                                              id: item.id,
                                              name: item.name,
                                              images: item.images
                                            })
                                          }
                                          className="flex items-center gap-3"
                                        >
                                          <Check
                                            className={cn(
                                              'h-4 w-4',
                                              form.itemSelections.some(
                                                (s) => s.childId === item.id
                                              )
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                            )}
                                          />
                                          <img
                                            src={firstImage}
                                            alt={item.name}
                                            className="h-10 w-10 rounded object-cover"
                                          />
                                          <span>{item.name}</span>
                                        </CommandItem>
                                      );
                                    })}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          {form.itemSelections.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {form.itemSelections.map((it) => {
                                const firstImage =
                                  it.images?.[0] ||
                                  'https://via.placeholder.com/60?text=Item';

                                return (
                                  <div
                                    key={it.childId}
                                    className="flex items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 p-2.5 transition-colors hover:border-rose-300"
                                  >
                                    <img
                                      src={firstImage}
                                      alt={it.name}
                                      className="h-12 w-12 rounded object-cover"
                                    />
                                    <span className="flex-1 text-sm font-medium text-gray-900">
                                      {it.name}
                                    </span>
                                    <Input
                                      type="number"
                                      className="h-9 w-20 border-rose-300 bg-white text-center focus:border-rose-500"
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
                                      className="h-7 w-7 rounded-full text-rose-700 hover:bg-rose-200 hover:text-rose-900"
                                      onClick={() =>
                                        handleSelect('item', {
                                          id: it.childId,
                                          name: it.name,
                                          images: JSON.stringify(it.images)
                                        })
                                      }
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Images Upload */}
                  <div className="rounded-lg border-2 border-dashed border-rose-200 bg-rose-50/30 p-5">
                    <Label className="mb-3 block text-sm font-semibold text-gray-700">
                      Ảnh mẫu sản phẩm mong muốn
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
                      <p className="text-sm font-medium text-red-900">
                        {error}
                      </p>
                    </div>
                  )}
                  {success && (
                    <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <p className="text-sm font-medium text-green-900">
                        Tạo sản phẩm thành công! Đang chuyển sang bước tiếp
                        theo...
                      </p>
                    </div>
                  )}

                  {/* Submit button */}
                  <div className="flex justify-end gap-3 border-t border-rose-100 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="min-w-24 border-rose-200 hover:bg-rose-50"
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
                        <span className="flex items-center gap-2">
                          Tiếp Theo
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              ) : currentStep === 1 && activeTab === 'existing' ? (
                <div className="py-8 text-center">
                  <Flower2 className="mx-auto h-16 w-16 text-rose-300" />
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    Chọn sản phẩm từ danh sách bên trái
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Click vào một sản phẩm để xem chi tiết và đặt hàng
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitOrder} className="space-y-6">
                  {/* Product Preview */}
                  {(createdProduct || selectedExistingProduct) && (
                    <div className="rounded-xl border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 p-6">
                      <div className="mb-4 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <h3 className="text-lg font-bold text-gray-900">
                          Sản phẩm đã chọn
                        </h3>
                      </div>
                      <div className="flex gap-6">
                        {(() => {
                          const product =
                            createdProduct || selectedExistingProduct;
                          const productImages = parseImages(
                            product.images || '[]'
                          );
                          const firstImage =
                            productImages[0] ||
                            'https://via.placeholder.com/128?text=Hoa';
                          const totalPrice = calculateTotalPrice(product);

                          return (
                            <>
                              <img
                                src={firstImage}
                                alt={product.name}
                                className="h-32 w-32 rounded-lg object-cover shadow-md"
                              />
                              <div className="flex-1">
                                <h4 className="text-xl font-bold text-gray-900">
                                  {product.name}
                                </h4>
                                <p className="mt-1 text-sm text-gray-600">
                                  {product.description}
                                </p>
                                {totalPrice > 0 && (
                                  <p className="mt-3 text-lg font-bold text-rose-600">
                                    Giá dự kiến:{' '}
                                    {totalPrice.toLocaleString('vi-VN')}đ
                                  </p>
                                )}
                                {product.compositions &&
                                  product.compositions.length > 0 && (
                                    <div className="mt-3 space-y-1">
                                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Thành phần:
                                      </p>
                                      <div className="flex flex-wrap gap-2">
                                        {product.compositions.map(
                                          (comp: any) => (
                                            <span
                                              key={comp.childId}
                                              className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-800"
                                            >
                                              {comp.childName} x{comp.quantity}
                                            </span>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Order Form */}
                  <div className="space-y-4">
                    {/* Address Selection with Quick Pick - NEW FEATURE */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                          Địa chỉ giao hàng
                          <span className="text-rose-500">*</span>
                        </Label>
                        {deliveryAddresses.length > 0 && (
                          <Popover
                            open={openAddress}
                            onOpenChange={setOpenAddress}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 border-rose-200 text-xs text-rose-600 hover:border-rose-400 hover:bg-rose-50 hover:text-rose-700"
                              >
                                <MapPin className="mr-1.5 h-3.5 w-3.5" />
                                Chọn địa chỉ có sẵn
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-[500px] p-0"
                              align="end"
                            >
                              <Command>
                                <CommandInput placeholder="Tìm địa chỉ..." />
                                <CommandList>
                                  <CommandEmpty>
                                    Không tìm thấy địa chỉ.
                                  </CommandEmpty>
                                  <CommandGroup heading="Địa chỉ đã lưu">
                                    {deliveryAddresses.map((address: any) => (
                                      <CommandItem
                                        key={address.id}
                                        value={`${address.address} ${address.phoneNumber}`}
                                        onSelect={() =>
                                          handleSelectAddress(address)
                                        }
                                        className="flex items-start gap-3 py-3"
                                      >
                                        <Check
                                          className={cn(
                                            'mt-0.5 h-4 w-4 shrink-0',
                                            selectedAddressId === address.id
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                            <p className="font-semibold text-gray-900">
                                              {address.recipientName}
                                            </p>
                                            {address.default && (
                                              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
                                                Mặc định
                                              </span>
                                            )}
                                          </div>
                                          <div className="mt-1 flex items-start gap-2 text-sm text-gray-600">
                                            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                            <span>{address.address}</span>
                                          </div>
                                          <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                                            <Phone className="h-3.5 w-3.5" />
                                            <span>{address.phoneNumber}</span>
                                          </div>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>

                      {selectedAddressId && (
                        <div className="mb-2 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                          <span className="text-sm font-medium text-green-900">
                            Đã chọn địa chỉ có sẵn
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="ml-auto h-6 text-xs text-green-700 hover:bg-green-100 hover:text-green-900"
                            onClick={() => {
                              setSelectedAddressId(null);
                              setOrderForm((prev) => ({
                                ...prev,
                                shippingAddress: '',
                                phoneNumber: ''
                              }));
                            }}
                          >
                            Xóa
                          </Button>
                        </div>
                      )}

                      <Textarea
                        value={orderForm.shippingAddress}
                        onChange={(e) => {
                          setSelectedAddressId(null);
                          setOrderForm((s) => ({
                            ...s,
                            shippingAddress: e.target.value
                          }));
                        }}
                        placeholder="Số 10 Hoàng Hoa Thám, Quận Tân Bình, TP.HCM"
                        required
                        rows={3}
                        className="border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                          Số điện thoại
                          <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          type="tel"
                          value={orderForm.phoneNumber}
                          onChange={(e) => {
                            setSelectedAddressId(null);
                            setOrderForm((s) => ({
                              ...s,
                              phoneNumber: e.target.value
                            }));
                          }}
                          placeholder="0941720502"
                          required
                          className="h-11 border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        />
                      </div>
                      <div>
                        <Label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                          Số lượng
                          <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          type="number"
                          value={orderForm.quantity}
                          onChange={(e) =>
                            setOrderForm((s) => ({
                              ...s,
                              quantity: Number(e.target.value)
                            }))
                          }
                          placeholder="1"
                          required
                          min={1}
                          className="h-11 border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Clock className="h-4 w-4" />
                        Thời gian giao hàng mong muốn
                        <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        type="datetime-local"
                        value={orderForm.requestDeliveryTime}
                        onChange={(e) =>
                          setOrderForm((s) => ({
                            ...s,
                            requestDeliveryTime: e.target.value
                          }))
                        }
                        required
                        min={new Date().toISOString().slice(0, 16)}
                        className="border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                      />
                    </div>
                    <div>
                      <Label className="mb-2 block text-sm font-semibold text-gray-700">
                        Ghi chú
                      </Label>
                      <Textarea
                        value={orderForm.note}
                        onChange={(e) =>
                          setOrderForm((s) => ({ ...s, note: e.target.value }))
                        }
                        placeholder="Giao hàng cẩn thận giúp tôi nhé..."
                        rows={3}
                        className="border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                      />
                    </div>
                  </div>

                  {/* Messages */}
                  {error && (
                    <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100">
                        <X className="h-3 w-3 text-red-600" />
                      </div>
                      <p className="text-sm font-medium text-red-900">
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Submit buttons */}
                  <div className="flex justify-between gap-3 border-t border-rose-100 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="min-w-32 border-rose-200 hover:bg-rose-50"
                      onClick={() => {
                        setCurrentStep(1);
                        setSelectedExistingProduct(null);
                        setSelectedAddressId(null);
                      }}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Quay lại
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="min-w-32 bg-gradient-to-r from-rose-600 to-pink-600 font-semibold shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                          Đang gửi...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4" />
                          Đặt Hàng Ngay
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
