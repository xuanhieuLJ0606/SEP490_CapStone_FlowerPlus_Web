'use client';

import type React from 'react';

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Mail, Shield } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import BaseRequest from '@/config/axios.config';

export default function VerifyEmail() {
  const { verificationToken } = useParams();
  const navigate = useNavigate();

  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
      setError('Mã xác thực phải là 6 chữ số');
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        verificationToken,
        verificationCode
      };

      const [err] = await BaseRequest.Post('/auth/verify-email', payload);

      if (err) {
        setError(
          err?.data?.message || 'Mã xác thực không hợp lệ hoặc đã hết hạn'
        );
        setIsLoading(false);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xác thực email');
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader className="rounded-t-lg bg-green-50">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <CardTitle className="text-green-800">
                Xác Thực Email Thành Công
              </CardTitle>
            </div>
            <CardDescription className="text-green-700">
              Email của bạn đã được xác thực thành công!
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Thành công</AlertTitle>
              <AlertDescription className="text-green-700">
                Bạn có thể đăng nhập vào hệ thống ngay bây giờ. Chúng tôi đã gửi
                email chào mừng đến hộp thư của bạn.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="pb-6">
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => navigate('/')}
            >
              Đến Trang Chủ
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="rounded-t-lg bg-blue-50">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-blue-800">Xác Thực Email</CardTitle>
          </div>
          <CardDescription className="text-blue-700">
            Nhập mã xác thực 6 chữ số đã được gửi đến email của bạn để hoàn tất
            đăng ký.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive" className="border-red-300 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800">Lỗi</AlertTitle>
                <AlertDescription className="text-red-700">
                  <p>{error}</p>
                  <p className="mt-2 flex gap-1 text-sm text-red-500">
                    Thử lại hoặc về trang chủ
                    <a href="/" className="font-bold underline">
                      tại đây
                    </a>
                  </p>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="verificationCode"
                className="font-medium text-gray-700"
              >
                Mã Xác Thực
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="verificationCode"
                  placeholder="Nhập mã 6 chữ số"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className="border-gray-200 bg-gray-50 py-6 pl-10 focus:border-blue-300 focus:ring-blue-200"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">
                Mã xác thực đã được gửi đến email của bạn
              </p>
            </div>

            <Button
              type="submit"
              className="mt-4 w-full bg-blue-600 py-6 transition-colors hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Đang Xác Thực...' : 'Xác Thực Email'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
