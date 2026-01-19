import { useState, useEffect } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useUpdatePersonalVoucher } from '@/queries/personal-voucher.query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { PersonalVoucher } from '../../list-data/columns';

const formSchema = z
  .object({
    type: z.enum(['PERCENTAGE', 'FIXED'], {
      required_error: 'Vui lòng chọn loại voucher'
    }),
    percent: z
      .union([z.number().min(0).max(100), z.undefined()])
      .optional()
      .nullable(),
    amount: z
      .union([z.number().min(0), z.undefined()])
      .optional()
      .nullable(),
    minOrderValue: z
      .union([z.number().min(0), z.undefined()])
      .optional()
      .nullable(),
    maxDiscountAmount: z
      .union([z.number().min(0), z.undefined()])
      .optional()
      .nullable(),
    startsAt: z.string().optional().nullable(),
    endsAt: z.string().optional().nullable(),
    usageLimit: z
      .union([z.number().min(1), z.undefined()])
      .optional()
      .nullable(),
    applyAllProducts: z.boolean().default(true),
    description: z.string().optional().nullable()
  })
  .refine(
    (data) => {
      if (data.type === 'PERCENTAGE') {
        return (
          data.percent !== undefined &&
          data.percent !== null &&
          data.percent > 0
        );
      }
      if (data.type === 'FIXED') {
        return (
          data.amount !== undefined && data.amount !== null && data.amount > 0
        );
      }
      return true;
    },
    {
      message: 'Vui lòng nhập giá trị giảm giá phù hợp với loại voucher',
      path: ['percent']
    }
  );

type FormValues = z.infer<typeof formSchema>;

interface UpdatePersonalVoucherProps {
  voucher: PersonalVoucher;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpdatePersonalVoucher({
  voucher,
  open,
  onOpenChange
}: UpdatePersonalVoucherProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updatePersonalVoucher = useUpdatePersonalVoucher();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: voucher.type,
      percent: voucher.percent,
      amount: voucher.amount,
      minOrderValue: voucher.minOrderValue,
      maxDiscountAmount: voucher.maxDiscountAmount,
      startsAt: voucher.startsAt
        ? new Date(voucher.startsAt).toISOString().slice(0, 16)
        : undefined,
      endsAt: voucher.endsAt
        ? new Date(voucher.endsAt).toISOString().slice(0, 16)
        : undefined,
      usageLimit: voucher.usageLimit,
      applyAllProducts: voucher.applyAllProducts,
      description: undefined
    }
  });

  useEffect(() => {
    if (open && voucher) {
      form.reset({
        type: voucher.type,
        percent: voucher.percent,
        amount: voucher.amount,
        minOrderValue: voucher.minOrderValue,
        maxDiscountAmount: voucher.maxDiscountAmount,
        startsAt: voucher.startsAt
          ? new Date(voucher.startsAt).toISOString().slice(0, 16)
          : undefined,
        endsAt: voucher.endsAt
          ? new Date(voucher.endsAt).toISOString().slice(0, 16)
          : undefined,
        usageLimit: voucher.usageLimit,
        applyAllProducts: voucher.applyAllProducts,
        description: undefined
      });
    }
  }, [open, voucher, form]);

  const watchType = form.watch('type');

  const onSubmit = async (values: FormValues) => {
    console.log('Form submitted with values:', values);
    console.log('Form errors:', form.formState.errors);
    console.log('Form is valid:', form.formState.isValid);

    try {
      setIsSubmitting(true);

      // Format payload according to UpdateVoucherDto
      const payload: any = {
        type: values.type,
        percent: values.type === 'PERCENTAGE' ? values.percent : undefined,
        amount: values.type === 'FIXED' ? values.amount : undefined,
        minOrderValue: values.minOrderValue,
        maxDiscountAmount:
          values.type === 'PERCENTAGE' ? values.maxDiscountAmount : undefined,
        startsAt: values.startsAt
          ? new Date(values.startsAt).toISOString()
          : undefined,
        endsAt: values.endsAt
          ? new Date(values.endsAt).toISOString()
          : undefined,
        usageLimit: values.usageLimit,
        applyAllProducts: values.applyAllProducts
      };

      // Remove undefined values
      Object.keys(payload).forEach(
        (key) => payload[key] === undefined && delete payload[key]
      );

      console.log('Updating personal voucher:', {
        voucherId: voucher.voucherId,
        payload
      });

      const [err, data] = await updatePersonalVoucher.mutateAsync({
        voucherId: voucher.voucherId,
        payload
      });

      console.log('Update response:', { err, data });

      if (err) {
        console.error('Update error:', err);
        const errorMessage =
          err?.data?.message ||
          err?.data?.error ||
          err?.message ||
          'Có lỗi xảy ra khi cập nhật voucher';
        toast.error(errorMessage);
        return;
      }

      console.log('Update successful:', data);
      toast.success('Voucher cá nhân đã được cập nhật thành công!');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast.error(
        error?.message ||
          error?.response?.data?.message ||
          'Có lỗi xảy ra khi cập nhật voucher'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: any) => {
    console.log('Form validation errors:', errors);
    toast.error('Vui lòng kiểm tra lại thông tin đã nhập');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa Voucher Cá Nhân</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin voucher cho {voucher.userName}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log('Form onSubmit event triggered');
              form.handleSubmit(onSubmit, onError)(e);
            }}
            className="space-y-6"
          >
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium">Thông tin người dùng</p>
              <p className="text-sm text-muted-foreground">
                {voucher.userName} ({voucher.userEmail})
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Mã voucher: <span className="font-mono">{voucher.code}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                          value={field.value || ''}
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
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>Số tiền giảm giá (VNĐ)</FormDescription>
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
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        value={field.value || ''}
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
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                          value={field.value || ''}
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
                      <Input
                        type="datetime-local"
                        {...field}
                        value={field.value || ''}
                      />
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
                      <Input
                        type="datetime-local"
                        {...field}
                        value={field.value || ''}
                      />
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
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        value={field.value || ''}
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
                      Voucher có thể sử dụng cho tất cả sản phẩm trong cửa hàng
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
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Mô tả ngắn gọn về voucher (tùy chọn)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={() => {
                  console.log('Submit button clicked');
                  console.log('Form state:', {
                    isValid: form.formState.isValid,
                    errors: form.formState.errors,
                    values: form.getValues()
                  });
                }}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Cập nhật voucher
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
