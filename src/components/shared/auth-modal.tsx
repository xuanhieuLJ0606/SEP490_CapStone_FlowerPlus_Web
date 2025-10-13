import { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, Loader2, Flower2, Phone, User, Home } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  useInitForgotPassword,
  useLogin,
  useRegister
} from '@/queries/auth.query';
import __helpers from '@/helpers';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone: string;
  age: number | '';
  gender: string;
  address: string;
};

export default function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'forgot' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerData, setRegisterData] = useState<RegisterPayload>({
    name: '', email: '', password: '', phone: '', age: '', gender: '', address: ''
  });

  const { mutateAsync: loginMutate, isPending: isLoginLoading } = useLogin();
  const { mutateAsync: initForgotPassword, isPending: isForgotLoading } = useInitForgotPassword();
  const { mutateAsync: registerMutate, isPending: isRegisterLoading } = useRegister();

  // ---- handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const [err, data] = await loginMutate({ email, password }); // hoặc { username: email, password } nếu API yêu cầu
    if (!err && data) {
      const token = (data as any).token ?? (data as any)?.data?.token;
      if (token) __helpers.cookie_set('AT', token);
      onOpenChange(false);
      window.location.reload();
    }
  };

  const handleLoginGoogle = () => {
    const a = document.createElement('a');
    // TODO: điền baseUrl phù hợp môi trường
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? (import.meta.env.VITE_API_URL as string)
        : (import.meta.env.VITE_API_URL as string);
    a.href = `${baseUrl}/api/auth/google-login`;
    a.target = '_self';
    a.click();
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const [err, data] = await initForgotPassword({ contactInfo: email });
    if (!err && data) {
      const resetToken =
        (data as any).data?.resetToken ?? (data as any).resetToken;
      if (resetToken) {
        window.location.href = `${window.location.origin}/auth/forgot-password/${resetToken}`;
      }
    }
  };

  const handleRegisterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: name === 'age' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !registerData.name || !registerData.email || !registerData.password ||
      !registerData.phone || !registerData.age || !registerData.gender || !registerData.address
    ) return;

    const [err] = await registerMutate(registerData);
    if (!err) {
      onOpenChange(false);
      window.location.reload();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-background p-0 sm:rounded-xl">
        <motion.div
          className="p-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22, mass: 0.8 }}
          style={{ transformOrigin: 'center' }}
        >
          <DialogHeader>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="bg-floral-accent/10 flex h-12 w-12 items-center justify-center rounded-full">
                <Flower2 className="text-floral-accent h-6 w-6" />
              </div>
              <DialogTitle className="text-balance font-serif text-2xl">
                {mode === 'login' ? 'Chào mừng trở lại' : mode === 'forgot' ? 'Quên mật khẩu?' : 'Đăng ký tài khoản mới'}
              </DialogTitle>
            </div>
          </DialogHeader>

          <AnimatePresence mode="wait" initial={false}>
            {mode === 'login' ? (
              <motion.div key="login" className="space-y-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18, ease: 'easeOut' }}>
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="ten@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="focus:border-floral-accent focus:ring-floral-accent/20 h-11 border-border pl-10" required disabled={isLoginLoading} />
                    </div>
                  </div>
                  {/* password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground">Mật khẩu</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="focus:border-floral-accent focus:ring-floral-accent/20 h-11 border-border pl-10" required disabled={isLoginLoading} />
                    </div>
                  </div>

                  <Button type="submit" className="h-11 w-full bg-green/80 font-medium text-white transition-colors hover:bg-green" disabled={isLoginLoading}>
                    {isLoginLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang đăng nhập...</>) : 'Đăng nhập'}
                  </Button>
                </form>

                <div className="space-x-2 text-center">
                  <button type="button" onClick={() => setMode('forgot')} className="text-sm font-medium text-green transition-colors hover:text-green/80">
                    Quên mật khẩu?
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><Separator className="w-full" /></div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-3 text-muted-foreground">Hoặc tiếp tục với</span>
                  </div>
                </div>

                <Button variant="outline" type="button" className="h-11 w-full border-border bg-transparent transition-colors hover:bg-accent hover:text-accent-foreground" onClick={handleLoginGoogle}>
                  {/* icon Google */}
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">...</svg>
                  Đăng nhập với Google
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Chưa có tài khoản?{' '}
                  <button type="button" onClick={() => setMode('register')} className="text-floral-accent hover:text-floral-accent/80 font-medium transition-colors">
                    Đăng ký ngay
                  </button>
                </p>
              </motion.div>
            ) : mode === 'forgot' ? (
              <motion.div key="forgot" className="space-y-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18, ease: 'easeOut' }}>
                <p className="text-pretty text-center text-sm text-muted-foreground">
                  Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu
                </p>
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email" className="text-sm font-medium text-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="reset-email" type="email" placeholder="ten@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="focus:border-floral-accent focus:ring-floral-accent/20 h-11 border-border pl-10" required disabled={isForgotLoading} />
                    </div>
                  </div>

                  <Button type="submit" className="h-11 w-full bg-green/80 font-medium text-white transition-colors hover:bg-green" disabled={isForgotLoading}>
                    {isForgotLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang gửi...</>) : 'Gửi link đặt lại mật khẩu'}
                  </Button>
                  <Button type="button" variant="ghost" className="h-11 w-full" onClick={() => setMode('login')} disabled={isForgotLoading}>
                    Quay lại đăng nhập
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="register" className="space-y-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18, ease: 'easeOut' }}>
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {/* các field register giữ nguyên như bạn viết */}
                  {/* ... */}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
