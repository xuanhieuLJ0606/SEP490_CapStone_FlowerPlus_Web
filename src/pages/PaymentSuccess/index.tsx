import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Thanh toán thành công!</CardTitle>
          <CardDescription className="text-base">
            Cảm ơn bạn đã mua sắm tại FlowerPlus. Đơn hàng của bạn đã được xác
            nhận và đang được xử lý.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Tự động chuyển về trang chủ sau {countdown} giây...
          </div>
          <Button onClick={handleGoHome} className="w-full" size="lg">
            <Home className="mr-2 h-4 w-4" />
            Về trang chủ ngay
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
