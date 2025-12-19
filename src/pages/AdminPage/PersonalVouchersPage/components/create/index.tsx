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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useCreatePersonalVoucher } from '@/queries/personal-voucher.query';
import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';
import UserSelector from '../user-selector';

const formSchema = z
  .object({
    targetUserId: z.number().min(1, 'Vui lòng chọn người dùng'),
    code: z.string().optional(),
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
      path: ['percent'] // This will show error on percent field
    }
  );

type FormValues = z.infer<typeof formSchema>;

export default function CreatePersonalVoucher() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createPersonalVoucher = useCreatePersonalVoucher();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applyAllProducts: true,
      type: 'PERCENTAGE'
    }
  });

  const watchType = form.watch('type');

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      // Convert date strings to ISO format if provided
      const payload = {
        ...values,
        startsAt: values.startsAt
          ? new Date(values.startsAt).toISOString()
          : undefined,
        endsAt: values.endsAt
          ? new Date(values.endsAt).toISOString()
          : undefined
      };

      await createPersonalVoucher.mutateAsync(payload);
      toast.success('Voucher cá nhân đã được tạo thành công!');
      form.reset();
    } catch (error: any) {
      toast.error(error?.message || 'Có lỗi xảy ra khi tạo voucher');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Tạo Voucher Cá Nhân
          </CardTitle>
          <CardDescription>
            Tạo voucher riêng biệt cho một người dùng cụ thể
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* User Selection */}
              <FormField
                control={form.control}
                name="targetUserId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Người dùng nhận voucher *</FormLabel>
                    <FormControl>
                      <UserSelector
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Chọn người dùng..."
                      />
                    </FormControl>
                    <FormDescription>
                      Chọn người dùng sẽ nhận voucher này
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Voucher Code */}
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã voucher</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Để trống để tự động tạo mã"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Nếu để trống, hệ thống sẽ tự động tạo mã unique
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

                {/* Max Discount Amount (for percentage type) */}
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

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả về voucher này..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Mô tả ngắn gọn về voucher (tùy chọn)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Đặt lại
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Tạo voucher
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
