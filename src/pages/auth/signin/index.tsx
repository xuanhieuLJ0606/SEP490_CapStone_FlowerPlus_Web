'use client';

import { useState } from 'react';
import UserAuthForm from './components/user-auth-form';
import { useInitForgotPassword } from '@/queries/auth.query';
import { Flower2 } from 'lucide-react';
import ForgotPasswordForm from './components/forgot-password-form';
import RegisterForm from '../signup/components/register-form';

export default function SignInPage() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const { mutateAsync: initForgotPassword } = useInitForgotPassword();

  const handleForgotPassword = async (email: string) => {
    const [err, data] = await initForgotPassword({ contactInfo: email });
    console.log('data', data);
    if (!err && data) {
      const { resetToken } = data.data;
      window.location.href = `${window.location.origin}/auth/forgot-password/${resetToken}`;
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left side - Floral image */}
      <div className="bg-floral relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100/40 via-transparent to-emerald-50/40" />
        <img
          src="https://flowermoxie.com/cdn/shop/files/glow_up_home_page_3.jpg?format=webp&v=1754412369&width=1296"
          alt="Beautiful flowers"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/40 via-transparent to-transparent p-12">
          <div className="text-white">
            <h2 className="mb-3 text-balance font-serif text-2xl">
              Flower Plus - Quản trị
            </h2>
            <p className="text-pretty text-lg text-white/90">
              Những bông hoa tươi đẹp nhất dành cho những khoảnh khắc đáng nhớ
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Sign in form */}
      <div className="flex items-center justify-center bg-background p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and header */}
          <div className="flex flex-col items-center space-y-6 text-center">
            <a href="/" className="flex items-center gap-2 text-primary">
              <div className="bg-floral-accent/10 flex h-12 w-12 items-center justify-center rounded-full">
                <Flower2 className="text-floral-accent h-6 w-6" />
              </div>
            </a>

            {!showForgotPassword && (
              <div className="space-y-2">
                <h1 className="text-balance font-serif text-3xl text-foreground">
                  {showRegister ? 'Tạo tài khoản' : 'Chào mừng trở lại'}
                </h1>
                <p className="text-pretty text-muted-foreground">
                  {showRegister
                    ? 'Ghé FlowerPlus và bắt đầu đặt hoa'
                    : 'Đăng nhập với tài khoản quản trị'}
                </p>
              </div>
            )}
          </div>

          {/* Form content */}
          <div className="space-y-6">
            {showForgotPassword ? (
              <ForgotPasswordForm
                onSubmit={handleForgotPassword}
                onCancel={() => setShowForgotPassword(false)}
              />
            ) : showRegister ? (
              <>
                <RegisterForm onSuccess={() => setShowRegister(false)} />
                <p className="text-center text-sm text-muted-foreground">
                  Đã có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => setShowRegister(false)}
                    className="cursor-pointer font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    Đăng nhập
                  </button>
                </p>
              </>
            ) : (
              <>
                <UserAuthForm />

                {/* <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-3 text-muted-foreground">
                      Hoặc tiếp tục với
                    </span>
                  </div>
                </div> */}

                {/* <Button
                  variant="outline"
                  type="button"
                  className="h-11 w-full border-border bg-transparent transition-colors hover:bg-accent hover:text-accent-foreground"
                  onClick={handleLoginGoogle}
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Đăng nhập với Google
                </Button> */}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}