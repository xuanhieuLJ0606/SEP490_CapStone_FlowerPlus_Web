'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
  onCancel: () => void;
}

export default function ForgotPasswordForm({
  onSubmit,
  onCancel
}: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      alert('Vui lòng nhập email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Email không hợp lệ');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(email);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-balance font-serif text-2xl text-foreground">
          Quên mật khẩu?
        </h2>
        <p className="text-pretty text-sm text-muted-foreground">
          Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="reset-email"
            className="text-sm font-medium text-foreground"
          >
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="reset-email"
              type="email"
              placeholder="ten@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus:border-floral-accent focus:ring-floral-accent/20 h-11 border-border pl-10"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="bg-floral-accent hover:bg-floral-accent/90 h-11 w-full font-medium text-white transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang gửi...
            </>
          ) : (
            'Gửi link đặt lại mật khẩu'
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="h-11 w-full"
          onClick={onCancel}
          disabled={isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại đăng nhập
        </Button>
      </form>
    </div>
  );
}
