'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Loader2, User } from 'lucide-react';
import { useLogin } from '@/queries/auth.query';
import __helpers from '@/helpers';
import { toast } from '@/components/ui/use-toast';

export default function UserAuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutateAsync: login } = useLogin();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const [err, data] = await login({ username: email, password });
    if (!err) {
      __helpers.cookie_set('AT', data.accessToken);
      window.location.href = '/admin/dashboard';
    } else {
      toast({
        title: 'Đăng nhập không thành công',
        description: err?.message,
        variant: 'warning'
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
