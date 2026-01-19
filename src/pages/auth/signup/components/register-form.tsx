import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useRegister } from '@/queries/auth.query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z
  .object({
    name: z.string().min(2, { message: 'Họ tên tối thiểu 2 ký tự' }),
    email: z.string().email({ message: 'Email không hợp lệ' }),
    password: z.string().min(6, { message: 'Mật khẩu tối thiểu 6 ký tự' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Xác nhận mật khẩu tối thiểu 6 ký tự' }),
    phone: z
      .string()
      .min(1, { message: 'Số điện thoại không được để trống' })
      .regex(/^(0|\+84)[0-9]{9,10}$/, {
        message: 'Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)'
      }),
    age: z
      .number({ invalid_type_error: 'Tuổi phải là số' })
      .int('Tuổi phải là số nguyên')
      .min(0, { message: 'Tuổi không hợp lệ' }),
    gender: z.string().min(1, { message: 'Vui lòng chọn giới tính' }),
    address: z.string().min(5, { message: 'Địa chỉ tối thiểu 5 ký tự' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword']
  });

type RegisterFormValue = z.infer<typeof formSchema>;

type RegisterFormProps = {
  onSuccess?: () => void;
};

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [loading, setLoading] = useState(false);
  const { mutateAsync: register } = useRegister();

  const form = useForm<RegisterFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      age: 0,
      gender: '',
      address: ''
    }
  });

  const onSubmit = async (data: RegisterFormValue) => {
    setLoading(true);
    try {
      const model = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        age: data.age,
        gender: data.gender,
        address: data.address
      };
      const [err] = await register(model);
      if (!err) onSuccess?.();
    } catch (err: any) {
      form.setError('email', {
        type: 'manual',
        message: err?.data?.message || 'Đăng ký không thành công'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập họ tên..."
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập email..."
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Mật khẩu..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Xác nhận mật khẩu</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Nhập lại mật khẩu..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập số điện thoại..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tuổi</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    disabled={loading}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giới tính</FormLabel>
              <FormControl>
                <Select
                  disabled={loading}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Nam</SelectItem>
                    <SelectItem value="female">Nữ</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành..."
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={loading} className="ml-auto w-full" type="submit">
          Tạo tài khoản
        </Button>
      </form>
    </Form>
  );
}
