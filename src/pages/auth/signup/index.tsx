'use client';

import { Link } from 'react-router-dom';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Bg from '@/assets/bg.jpg';
import { Separator } from '@/components/ui/separator';
import RegisterForm from './components/register-form';

export default function SignUpPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        to="/login"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 hidden md:right-8 md:top-8'
        )}
      >
        Đăng nhập
      </Link>

      {/* Left column with floral background */}
      <div className="relative hidden h-full flex-col bg-muted p-10 dark:border-r lg:flex">
        <div
          className="absolute inset-0 bg-secondary/60"
          style={{
            backgroundImage: `url(${Bg})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}
        ></div>

        <div className="relative z-20 flex items-center text-lg font-semibold text-primary-foreground">
          FlowerPlus - Cửa hàng hoa
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg text-primary-foreground">
              Nở rộ cảm xúc, kết nối yêu thương.
            </p>
          </blockquote>
        </div>
      </div>

      {/* Right column with register form */}
      <div className="flex h-full items-center justify-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Tạo tài khoản
            </h1>
            <p className="text-sm text-muted-foreground">
              Ghé FlowerPlus và bắt đầu đặt hoa
            </p>
          </div>

          <RegisterForm />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Đã có tài khoản?
              </span>
            </div>
          </div>

          <Button asChild variant="outline" className="w-full">
            <Link to="/login">Đăng nhập</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}