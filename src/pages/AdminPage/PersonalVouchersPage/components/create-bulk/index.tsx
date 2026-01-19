import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useCreateBulkPersonalVouchers } from '@/queries/personal-voucher.query';
import { useGetListProductByPaging } from '@/queries/product.query';
import { TYPE_PRODUCT } from '@/pages/AdminPage/ProductsPage/list/overview';
import { toast } from 'sonner';
import { Loader2, Users, AlertCircle, Package } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MultiUserSelector from '../multi-user-selector';

const formSchema = z
  .object({
    targetUserIds: z
      .array(z.number())
      .min(1, 'Vui lòng chọn ít nhất một người dùng'),
    codePrefix: z.string().optional(),
    type: z.enum(['PERCENTAGE', 'FIXED'], {
      required_error: 'Vui lòng chọn loại voucher'
    }),
    percent: z.number().min(0).max(100).optional(),
    amount: z.number().min(0).optional(),
    minOrderValue: z.number().min(0).optional(),
    maxDiscountAmount: z.number().min(0).optional(),
    startsAt: z.string().optional(),
    endsAt: z.string().optional(),
    usageLimit: z.number().min(1).optional(),
    applyAllProducts: z.boolean().default(true),
    productIds: z.array(z.number()).optional(),
    description: z.string().optional()
  })
  .refine(
    (data) => {
      if (data.type === 'PERCENTAGE') {
        return data.percent !== undefined && data.percent > 0;
      }
      if (data.type === 'FIXED') {
        return data.amount !== undefined && data.amount > 0;
      }
      return true;
    },
    {
      message: 'Vui lòng nhập giá trị giảm giá phù hợp với loại voucher',
      path: ['percent']
    }
  );

type FormValues = z.infer<typeof formSchema>;

export default function CreateBulkVouchers() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const createBulkVouchers = useCreateBulkPersonalVouchers();
  const { data: resProducts } = useGetListProductByPaging(
    1,
    100,
    '',
    TYPE_PRODUCT.PRODUCT
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applyAllProducts: true,
      type: 'PERCENTAGE',
      targetUserIds: []
    }
  });

  const watchType = form.watch('type');
  const watchUserIds = form.watch('targetUserIds');
  const applyAllProducts = form.watch('applyAllProducts');
  const products = resProducts?.listObjects || [];

  const parseImages = (images: string) => {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null;
    } catch {
      return null;
    }
  };

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

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      setResult(null);

      const payload = {
        ...values,
        startsAt: values.startsAt
          ? new Date(values.startsAt).toISOString()
          : undefined,
        endsAt: values.endsAt
          ? new Date(values.endsAt).toISOString()
          : undefined,
        productIds: applyAllProducts ? [] : selectedProducts
      };

      const response = await createBulkVouchers.mutateAsync(payload);
      setResult(response);

      const responseData = response as any;
      if (responseData.failureCount === 0) {
        toast.success(
          `Đã tạo thành công ${responseData.successCount} voucher cá nhân!`
        );
        form.reset();
      } else {
        toast.warning(
          `Tạo thành công ${responseData.successCount}/${responseData.totalRequested} voucher. ${responseData.failureCount} voucher thất bại.`
        );
      }
    } catch (error: any) {
      toast.error(error?.message || 'Có lỗi xảy ra khi tạo voucher hàng loạt');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Tạo Voucher Hàng Loạt
          </CardTitle>
          <CardDescription>
            Tạo voucher cá nhân cho nhiều người dùng cùng lúc với cùng một
            template
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* User Selection */}
              <FormField
                control={form.control}
                name="targetUserIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Người dùng nhận voucher *</FormLabel>
                    <FormControl>
                      <MultiUserSelector
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Chọn nhiều người dùng..."
                      />
                    </FormControl>
                    <FormDescription>
                      Đã chọn {watchUserIds.length} người dùng
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchUserIds.length > 10 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Bạn đang tạo voucher cho {watchUserIds.length} người dùng.
                    Quá trình này có thể mất một chút thời gian.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Code Prefix */}
                <FormField
                  control={form.control}
                  name="codePrefix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiền tố mã voucher</FormLabel>
                      <FormControl>
                        <Input placeholder="BULK" {...field} />
                      </FormControl>
                      <FormDescription>
                        Tiền tố cho mã voucher (VD: BULK-XXXXXXXX)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Voucher Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại voucher *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại voucher" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PERCENTAGE">
                            Giảm theo phần trăm (%)
                          </SelectItem>
                          <SelectItem value="FIXED">
                            Giảm số tiền cố định (VNĐ)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Discount Value */}
                {watchType === 'PERCENTAGE' ? (
                  <FormField
                    control={form.control}
                    name="percent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phần trăm giảm giá *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="10"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>Từ 1% đến 100%</FormDescription>
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
                        <FormLabel>Số tiền giảm giá *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="50000"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Số tiền giảm giá (VNĐ)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Min Order Value */}
                <FormField
                  control={form.control}
                  name="minOrderValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá trị đơn hàng tối thiểu</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="100000"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Để trống nếu không có yêu cầu tối thiểu
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Max Discount Amount */}
                {watchType === 'PERCENTAGE' && (
                  <FormField
                    control={form.control}
                    name="maxDiscountAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số tiền giảm tối đa</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="200000"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Giới hạn số tiền giảm tối đa (VNĐ)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Start Date */}
                <FormField
                  control={form.control}
                  name="startsAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày bắt đầu</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormDescription>
                        Để trống nếu có hiệu lực ngay
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* End Date */}
                <FormField
                  control={form.control}
                  name="endsAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày kết thúc</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormDescription>
                        Để trống nếu không có thời hạn
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Usage Limit */}
                <FormField
                  control={form.control}
                  name="usageLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giới hạn sử dụng</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Số lần tối đa có thể sử dụng voucher
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Apply All Products */}
              <FormField
                control={form.control}
                name="applyAllProducts"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Áp dụng cho tất cả sản phẩm
                      </FormLabel>
                      <FormDescription>
                        Voucher có thể sử dụng cho tất cả sản phẩm trong cửa
                        hàng
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Product Selection */}
              {!applyAllProducts && (
                <div className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      Chọn sản phẩm ({selectedProducts.length} đã chọn)
                    </p>
                    {selectedProducts.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedProducts([])}
                      >
                        Bỏ chọn tất cả
                      </Button>
                    )}
                  </div>
                  <div className="grid max-h-96 grid-cols-1 gap-3 overflow-y-auto p-1 md:grid-cols-2">
                    {products.map((product: any) => {
                      const firstImage = parseImages(product.images);
                      const isSelected = selectedProducts.includes(product.id);

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
                            <p className="truncate font-medium">
                              {product.name}
                            </p>
                            <p className="truncate text-sm">
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

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả về batch voucher này..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Mô tả chung cho tất cả voucher trong batch này
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setResult(null);
                    setSelectedProducts([]);
                  }}
                >
                  Đặt lại
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Tạo {watchUserIds.length} voucher
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Result Display */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Kết quả tạo voucher hàng loạt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="rounded-lg bg-blue-50 p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {result.totalRequested}
                  </div>
                  <div className="text-sm text-blue-600">Tổng yêu cầu</div>
                </div>
                <div className="rounded-lg bg-green-50 p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {result.successCount}
                  </div>
                  <div className="text-sm text-green-600">Thành công</div>
                </div>
                <div className="rounded-lg bg-red-50 p-4">
                  <div className="text-2xl font-bold text-red-600">
                    {result.failureCount}
                  </div>
                  <div className="text-sm text-red-600">Thất bại</div>
                </div>
              </div>

              {result.errors && result.errors.length > 0 && (
                <div>
                  <h4 className="mb-2 font-medium text-red-600">
                    Lỗi chi tiết:
                  </h4>
                  <div className="space-y-2">
                    {result.errors.map((error: any, index: number) => (
                      <div
                        key={index}
                        className="rounded-lg bg-red-50 p-3 text-sm"
                      >
                        <div className="font-medium">
                          User: {error.userName || `ID ${error.userId}`}
                        </div>
                        <div className="text-red-600">{error.errorMessage}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
