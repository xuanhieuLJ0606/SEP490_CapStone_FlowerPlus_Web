import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, Loader2, Flower2, Phone, User } from 'lucide-react';
import {
  useInitForgotPassword,
  useLogin,
  useRegister
} from '@/queries/auth.query';
import { AnimatePresence, motion } from 'framer-motion';
import __helpers from '@/helpers';
import { toast } from '../ui/use-toast';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type RegisterPayload = {
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
};

export default function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'forgot' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  // Register fields
  const [registerData, setRegisterData] = useState<RegisterPayload>({
    userName: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  const { mutateAsync: loginMutate, isPending: isLoginLoading } = useLogin();
  const { mutateAsync: initForgotPassword, isPending: isForgotLoading } =
    useInitForgotPassword();
  const { mutateAsync: registerMutate, isPending: isRegisterLoading } =
    useRegister?.() ?? {};

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const [err, data] = await loginMutate({ username: username, password });
    console.log(data);
    if (!err) {
      onOpenChange(false);
      __helpers.cookie_set('AT', data.accessToken);
      window.location.reload();
    }
  };

  const handleLoginGoogle = () => {
    const a = document.createElement('a');
    const url = process.env.NODE_ENV === 'production' ? '' : '';
    a.href = `${url}/api/auth/google-login`;
    a.target = '_self';
    a.click();
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const [err] = await initForgotPassword({ contactInfo: email });
    if (!err) {
      toast({
        title: 'Đặt lại mật khẩu thành công',
        description:
          'Gửi mail đặt lại mật khẩu thành công, check mail để lấy link',
        variant: 'success'
      });
    }
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !registerData.userName ||
      !registerData.email ||
      !registerData.password ||
      !registerData.firstName
    ) {
      return;
    }
    const [err] = (await registerMutate?.(registerData)) ?? [true];
    if (!err) {
      // Hiển thị thông báo thành công
      alert(
        'Đăng ký thành công! Vui lòng kiểm tra email để xem thông tin chào mừng.'
      );
      onOpenChange(false);
      // Không reload để user có thể đăng nhập ngay
      setMode('login');
      setUsername(registerData.userName);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-background p-0 sm:rounded-xl">
        <motion.div
          className="p-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 22,
            mass: 0.8
          }}
          style={{ transformOrigin: 'center' }}
        >
          <DialogHeader>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="bg-floral-accent/10 flex h-12 w-12 items-center justify-center rounded-full">
                <Flower2 className="text-floral-accent h-6 w-6" />
              </div>
              <DialogTitle className="text-balance font-serif text-2xl">
                {mode === 'login'
                  ? 'Chào mừng trở lại'
                  : mode === 'forgot'
                    ? 'Quên mật khẩu?'
                    : 'Đăng ký tài khoản mới'}
              </DialogTitle>
            </div>
          </DialogHeader>

          <AnimatePresence mode="wait" initial={false}>
            {mode === 'login' ? (
              <motion.div
                key="login"
                className="space-y-6"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="username"
                      className="text-sm font-medium text-foreground"
                    >
                      Tên đăng nhập
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="focus:border-floral-accent focus:ring-floral-accent/20 h-11 border-border pl-10"
                        required
                        disabled={isLoginLoading}
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
                        disabled={isLoginLoading}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="h-11 w-full bg-rose-600/80 font-medium text-white transition-colors hover:bg-rose-700"
                    disabled={isLoginLoading}
                  >
                    {isLoginLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang đăng nhập...
                      </>
                    ) : (
                      'Đăng nhập'
                    )}
                  </Button>
                </form>

                <div className="space-x-2 text-center">
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-sm font-medium text-rose-600 transition-colors hover:text-rose-700"
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-3 text-muted-foreground">
                      Hoặc tiếp tục với
                    </span>
                  </div>
                </div>

                <Button
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
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Chưa có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-floral-accent hover:text-floral-accent/80 font-medium transition-colors"
                  >
                    Đăng ký ngay
                  </button>
                </p>
              </motion.div>
            ) : mode === 'forgot' ? (
              <motion.div
                key="forgot"
                className="space-y-6"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <p className="text-pretty text-center text-sm text-muted-foreground">
                  Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu
                </p>
                <form onSubmit={handleForgotSubmit} className="space-y-4">
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
                        disabled={isForgotLoading}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="h-11 w-full bg-rose-600/80 font-medium text-white transition-colors hover:bg-rose-700"
                    disabled={isForgotLoading}
                  >
                    {isForgotLoading ? (
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
                    onClick={() => setMode('login')}
                    disabled={isForgotLoading}
                  >
                    Quay lại đăng nhập
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                className="space-y-6"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="register-username"
                      className="text-sm font-medium text-foreground"
                    >
                      Tên đăng nhập <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="register-username"
                        name="userName"
                        type="text"
                        placeholder="username"
                        value={registerData.userName}
                        onChange={handleRegisterChange}
                        className="focus:border-floral-accent focus:ring-floral-accent/20 h-11 border-border pl-10"
                        required
                        disabled={isRegisterLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="register-email"
                      className="text-sm font-medium text-foreground"
                    >
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        placeholder="ten@gmail.com"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        className="focus:border-floral-accent focus:ring-floral-accent/20 h-11 border-border pl-10"
                        required
                        disabled={isRegisterLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="register-password"
                      className="text-sm font-medium text-foreground"
                    >
                      Mật khẩu <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="register-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        className="focus:border-floral-accent focus:ring-floral-accent/20 h-11 border-border pl-10"
                        required
                        minLength={6}
                        disabled={isRegisterLoading}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Mật khẩu phải có ít nhất 6 ký tự
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="register-firstname"
                      className="text-sm font-medium text-foreground"
                    >
                      Họ <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="register-firstname"
                        name="firstName"
                        type="text"
                        placeholder="Nguyễn"
                        value={registerData.firstName}
                        onChange={handleRegisterChange}
                        className="focus:border-floral-accent focus:ring-floral-accent/20 h-11 border-border pl-10"
                        required
                        disabled={isRegisterLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="register-lastname"
                      className="text-sm font-medium text-foreground"
                    >
                      Tên
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="register-lastname"
                        name="lastName"
                        type="text"
                        placeholder="Văn A"
                        value={registerData.lastName}
                        onChange={handleRegisterChange}
                        className="focus:border-floral-accent focus:ring-floral-accent/20 h-11 border-border pl-10"
                        disabled={isRegisterLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="register-phone"
                      className="text-sm font-medium text-foreground"
                    >
                      Số điện thoại
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="register-phone"
                        name="phone"
                        type="tel"
                        placeholder="0981234567"
                        value={registerData.phone}
                        onChange={handleRegisterChange}
                        className="focus:border-floral-accent focus:ring-floral-accent/20 h-11 border-border pl-10"
                        disabled={isRegisterLoading}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="h-11 w-full bg-rose-600/80 font-medium text-white transition-colors hover:bg-rose-700"
                    disabled={isRegisterLoading}
                  >
                    {isRegisterLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang đăng ký...
                      </>
                    ) : (
                      'Đăng ký'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-11 w-full"
                    onClick={() => setMode('login')}
                    disabled={isRegisterLoading}
                  >
                    Quay lại đăng nhập
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
