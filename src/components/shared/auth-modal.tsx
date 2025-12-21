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
    console.log(err);
    if (!err) {
      alert(
        'Đăng ký thành công! Vui lòng kiểm tra email để xem thông tin chào mừng.'
      );
      onOpenChange(false);
      // Không reload để user có thể đăng nhập ngay
      setMode('login');
      setUsername(registerData.userName);
    } else {
      toast({
        title: 'Đăng ký thất bại',
        description: err?.data?.message || 'Đăng ký thất bại',
        variant: 'destructive'
      });
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
