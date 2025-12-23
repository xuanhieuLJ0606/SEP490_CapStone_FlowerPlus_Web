'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Loader2, User } from 'lucide-react';
import { useAdminLogin } from '@/queries/admin-auth.query';
import __helpers from '@/helpers';
import { toast } from '@/components/ui/use-toast';
import { useGetMyInfo } from '@/queries/auth.query';

export default function UserAuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutateAsync: adminLogin } = useAdminLogin();
  const { refetch: refetchInfoUser } = useGetMyInfo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập username',
        variant: 'destructive'
      });
      return;
    }
    if (!password.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập mật khẩu',
        variant: 'destructive'
      });
      return;
    }
    if (password.length < 6) {
      toast({
        title: 'Lỗi',
        description: 'Mật khẩu phải có ít nhất 6 ký tự',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const [_, data] = await adminLogin({ username: email, password });
      __helpers.cookie_set('AT', data.accessToken);

      const infoUser = await refetchInfoUser();
      toast({
        title: 'Đăng nhập thành công',
        description: 'Chào mừng bạn đến với trang quản trị',
        variant: 'default'
      });

      // window.location.href =
      //   infoUser?.role === 'STAFF' ? '/admin/orders' : '/admin/dashboard';
      console.log('infoUser', infoUser.data);
      if (infoUser.data?.role === 'STAFF') {
        window.location.href = '/admin/orders';
      } else {
        window.location.href = '/admin/dashboard';
      }
    } catch (error: any) {
      toast({
        title: 'Đăng nhập không thành công',
        description: error?.data?.message || 'Bạn không có quyền truy cập',
        variant: 'destructive'
      });
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-foreground">
          Username
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="username"
            type="text"
            placeholder="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus:border-floral-accent focus:ring-floral-accent/20 h-11 border-border pl-10"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-sm font-medium text-foreground"
        >
          Mật khẩu
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus:border-floral-accent focus:ring-floral-accent/20 h-11 border-border pl-10"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="h-11 w-full bg-rose-500 font-medium text-white transition-colors hover:bg-rose-600"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Đang đăng nhập...
          </>
        ) : (
          'Đăng nhập'
        )}
      </Button>
    </form>
  );
}
