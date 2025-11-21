import { useCreateVoucher } from '@/queries/voucher.query';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGetListProductByPaging } from '@/queries/product.query';
import { TYPE_PRODUCT } from '@/pages/AdminPage/ProductsPage/list/overview';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  CalendarIcon,
  Tag,
  Percent,
  DollarSign,
  Package,
  Clock,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

const voucherSchema = z
  .object({
    code: z
      .string()
      .min(3, 'Mã voucher phải có ít nhất 3 ký tự')
      .max(64, 'Mã voucher tối đa 64 ký tự'),
    type: z.enum(['PERCENTAGE', 'FIXED'], {
      required_error: 'Vui lòng chọn loại voucher'
    }),
    percent: z.number().min(0).max(1).optional(),
    amount: z.number().min(0).optional(),
    minOrderValue: z
      .number()
      .min(0, 'Giá trị đơn hàng tối thiểu phải lớn hơn 0'),
    maxDiscountAmount: z.number().min(0).optional(),
    startsAt: z.date({
      required_error: 'Vui lòng chọn ngày bắt đầu'
    }),
    endsAt: z.date({
      required_error: 'Vui lòng chọn ngày kết thúc'
    }),
    usageLimit: z.number().min(1, 'Giới hạn sử dụng phải lớn hơn 0'),
    applyAllProducts: z.boolean(),
    productIds: z.array(z.number()).optional()
  })
  .refine(
    (data) => {
      if (data.type === 'PERCENTAGE' && !data.percent) return false;
      if (data.type === 'FIXED' && !data.amount) return false;
      return true;
    },
    {
      message: 'Vui lòng nhập giá trị giảm giá',
      path: ['percent']
    }
  )
  .refine(
    (data) => {
      return data.endsAt > data.startsAt;
    },
    {
      message: 'Ngày kết thúc phải sau ngày bắt đầu',
      path: ['endsAt']
    }
  );

type VoucherFormData = z.infer<typeof voucherSchema>;

export default function Add() {
  const { mutateAsync: createVoucher, isPending } = useCreateVoucher();
  const { data: resProducts } = useGetListProductByPaging(
    1,
    100,
    '',
    TYPE_PRODUCT.PRODUCT
  );
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const form = useForm<VoucherFormData>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      code: '',
      type: 'FIXED',
      percent: 0,
      amount: 0,
      minOrderValue: 0,
      maxDiscountAmount: 0,
      usageLimit: 100,
      applyAllProducts: true,
      productIds: []
    }
  });

  const voucherType = form.watch('type');
  const applyAllProducts = form.watch('applyAllProducts');

  const onSubmit = async (data: VoucherFormData) => {
    try {
      const payload = {
        code: data.code,
        type: data.type,
        percent: data.type === 'PERCENTAGE' ? data.percent : 0,
        amount: data.type === 'FIXED' ? data.amount : 0,
        minOrderValue: data.minOrderValue,
        maxDiscountAmount: data.maxDiscountAmount || 0,
        startsAt: data.startsAt.toISOString(),
        endsAt: data.endsAt.toISOString(),
        usageLimit: data.usageLimit,
        applyAllProducts: data.applyAllProducts,
        productIds: data.applyAllProducts ? [] : selectedProducts
      };

      await createVoucher(payload);
      toast({
        title: 'Tạo voucher thành công!',
        description: 'Voucher đã được tạo thành công',
        variant: 'success'
      });
      form.reset();
      setSelectedProducts([]);
    } catch (error) {
      toast({
        title: 'Có lỗi xảy ra khi tạo voucher',
        description: 'Vui lòng kiểm tra lại thông tin',
        variant: 'destructive'
      });
      console.error(error);
    }
  };

  const products = resProducts?.listObjects || [];

  const handleProductToggle = (productId: number, checked: boolean) => {
    setSelectedProducts((prev) => {
      const isCurrentlySelected = prev.includes(productId);

      if (checked && !isCurrentlySelected) {
        return [...prev, productId];
      } else if (!checked && isCurrentlySelected) {
        return prev.filter((id) => id !== productId);
      }

      return prev;
    });
  };

  const parseImages = (images: string) => {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null;
    } catch {
      return null;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-xl bg-rose-500 p-3 shadow-lg">
              <Tag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold ">Tạo Voucher Mới</h1>
              <p className="mt-1 ">Tạo mã giảm giá cho khách hàng của bạn</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Thông tin cơ bản */}
            <Card className="border-rose-200 shadow-lg">
              <CardHeader className="border-b border-rose-100 bg-gradient-to-r from-rose-50 to-pink-50">
                <CardTitle className="flex items-center gap-2 ">
                  <Tag className="h-5 w-5" />
                  Thông tin cơ bản
                </CardTitle>
                <CardDescription className="">
                  Thiết lập mã và loại voucher
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {/* Mã voucher */}
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold ">
                        Mã voucher
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="VD: GIAM20HOA"
                          className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-sm ">
                        Mã voucher duy nhất, viết hoa không dấu
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Loại voucher */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold ">
                        Loại voucher
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-rose-200 focus:border-rose-400 focus:ring-rose-400">
                            <SelectValue placeholder="Chọn loại voucher" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="FIXED">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 " />
                              Giảm theo số tiền cố định
                            </div>
                          </SelectItem>
                          <SelectItem value="PERCENTAGE">
                            <div className="flex items-center gap-2">
                              <Percent className="h-4 w-4 " />
                              Giảm theo phần trăm
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Giá trị giảm */}
                  {voucherType === 'PERCENTAGE' ? (
                    <FormField
                      control={form.control}
                      name="percent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold ">
                            Phần trăm giảm
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max="1"
                                placeholder="VD: 0.2 (20%)"
                                className="border-rose-200 pr-12 focus:border-rose-400 focus:ring-rose-400"
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value))
                                }
                                value={field.value}
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 font-medium ">
                                %
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription className="text-sm ">
                            Nhập giá trị từ 0 đến 1 (VD: 0.2 = 20%)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold ">
                            Số tiền giảm
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                min="0"
                                placeholder="VD: 20000"
                                className="border-rose-200 pr-12 focus:border-rose-400 focus:ring-rose-400"
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value))
                                }
                                value={field.value}
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 font-medium ">
                                ₫
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription className="text-sm ">
                            Số tiền giảm cố định
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Giá trị đơn hàng tối thiểu */}
                  <FormField
                    control={form.control}
                    name="minOrderValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold ">
                          Giá trị đơn tối thiểu
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              min="0"
                              placeholder="VD: 50000"
                              className="border-rose-200 pr-12 focus:border-rose-400 focus:ring-rose-400"
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                              value={field.value}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 font-medium ">
                              ₫
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription className="text-sm ">
                          Đơn hàng tối thiểu để áp dụng voucher
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Giảm tối đa (cho % voucher) */}
                {voucherType === 'PERCENTAGE' && (
                  <FormField
                    control={form.control}
                    name="maxDiscountAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold ">
                          Số tiền giảm tối đa
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              min="0"
                              placeholder="VD: 100000"
                              className="border-rose-200 pr-12 focus:border-rose-400 focus:ring-rose-400"
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                              value={field.value}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 font-medium ">
                              ₫
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription className="text-sm ">
                          Giới hạn số tiền giảm tối đa cho voucher phần trăm
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            {/* Thời gian hiệu lực */}
            <Card className="border-rose-200 shadow-lg">
              <CardHeader className="border-b border-rose-100 bg-gradient-to-r from-rose-50 to-pink-50">
                <CardTitle className="flex items-center gap-2 ">
                  <Clock className="h-5 w-5" />
                  Thời gian hiệu lực
                </CardTitle>
                <CardDescription className="">
                  Thiết lập thời gian áp dụng voucher
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Ngày bắt đầu */}
                  <FormField
                    control={form.control}
                    name="startsAt"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="font-semibold ">
                          Ngày bắt đầu
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`w-full border-rose-200 pl-3 text-left font-normal hover:bg-rose-50 ${
                                  !field.value && 'text-muted-foreground'
                                }`}
                              >
                                {field.value ? (
                                  format(field.value, 'dd/MM/yyyy', {
                                    locale: vi
                                  })
                                ) : (
                                  <span>Chọn ngày</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 " />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                              locale={vi}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Ngày kết thúc */}
                  <FormField
                    control={form.control}
                    name="endsAt"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="font-semibold ">
                          Ngày kết thúc
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`w-full border-rose-200 pl-3 text-left font-normal hover:bg-rose-50 ${
                                  !field.value && 'text-muted-foreground'
                                }`}
                              >
                                {field.value ? (
                                  format(field.value, 'dd/MM/yyyy', {
                                    locale: vi
                                  })
                                ) : (
                                  <span>Chọn ngày</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 " />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                              locale={vi}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Giới hạn sử dụng */}
                <FormField
                  control={form.control}
                  name="usageLimit"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel className="font-semibold ">
                        Giới hạn sử dụng
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 " />
                          <Input
                            type="number"
                            min="1"
                            placeholder="VD: 100"
                            className="border-rose-200 pl-10 focus:border-rose-400 focus:ring-rose-400"
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                            value={field.value}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-sm ">
                        Số lần tối đa voucher có thể được sử dụng
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Sản phẩm áp dụng */}
            <Card className="border-rose-200 shadow-lg">
              <CardHeader className="border-b border-rose-100 bg-gradient-to-r from-rose-50 to-pink-50">
                <CardTitle className="flex items-center gap-2 ">
                  <Package className="h-5 w-5" />
                  Sản phẩm áp dụng
                </CardTitle>
                <CardDescription className="">
                  Chọn sản phẩm được áp dụng voucher
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {/* Áp dụng tất cả */}
                <FormField
                  control={form.control}
                  name="applyAllProducts"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-lg border border-rose-200 bg-rose-50/50 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-rose-300 data-[state=checked]:border-rose-500 data-[state=checked]:bg-rose-500"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="cursor-pointer font-semibold ">
                          Áp dụng cho tất cả sản phẩm
                        </FormLabel>
                        <FormDescription className="text-sm ">
                          Voucher sẽ được áp dụng cho tất cả các sản phẩm trong
                          shop
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Danh sách sản phẩm */}
                {!applyAllProducts && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium ">
                        Chọn sản phẩm ({selectedProducts.length} đã chọn)
                      </p>
                      {selectedProducts.length > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedProducts([])}
                          className=" hover:bg-rose-50 hover:text-rose-700"
                        >
                          Bỏ chọn tất cả
                        </Button>
                      )}
                    </div>
                    <div className="grid max-h-96 grid-cols-1 gap-3 overflow-y-auto p-1 md:grid-cols-2">
                      {products.map((product: any) => {
                        const firstImage = parseImages(product.images);
                        const isSelected = selectedProducts.includes(
                          product.id
                        );

                        return (
                          <label
                            key={product.id}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition-all ${
                              isSelected
                                ? 'border-rose-500 bg-rose-50 shadow-md'
                                : 'border-rose-200 bg-white hover:border-rose-300 hover:bg-rose-50/50'
                            }`}
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) =>
                                handleProductToggle(
                                  product.id,
                                  checked as boolean
                                )
                              }
                              className="border-rose-300 data-[state=checked]:border-rose-500 data-[state=checked]:bg-rose-500"
                            />
                            {firstImage ? (
                              <img
                                src={firstImage}
                                alt={product.name}
                                className="h-16 w-16 rounded-md border border-rose-200 object-cover"
                              />
                            ) : (
                              <div className="flex h-16 w-16 items-center justify-center rounded-md border border-rose-200 bg-rose-100">
                                <Package className="h-8 w-8 text-rose-300" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium ">
                                {product.name}
                              </p>
                              <p className="truncate text-sm ">
                                {product.categories?.[0]?.name ||
                                  'Chưa phân loại'}
                              </p>
                              <div className="mt-1 flex items-center gap-2">
                                {product.isActive ? (
                                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                    Đang bán
                                  </Badge>
                                ) : (
                                  <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                                    Tạm dừng
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="border-rose-300 text-rose-700 hover:bg-rose-50"
                onClick={() => {
                  form.reset();
                  setSelectedProducts([]);
                }}
              >
                Đặt lại
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-rose-500 text-white shadow-lg hover:bg-rose-600"
              >
                {isPending ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Tag className="mr-2 h-4 w-4" />
                    Tạo voucher
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
