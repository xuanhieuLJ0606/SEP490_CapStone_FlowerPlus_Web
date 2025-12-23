import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function PaymentFailure() {
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
            <div className="rounded-full bg-red-100 p-4">
              <XCircle className="h-16 w-16 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Thanh toán thất bại</CardTitle>
          <CardDescription className="text-base">
            Rất tiếc, quá trình thanh toán của bạn không thành công. Vui lòng
            thử lại hoặc liên hệ với chúng tôi nếu vấn đề vẫn tiếp tục.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Tự động chuyển về trang chủ sau {countdown} giây...
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleGoHome}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <Home className="mr-2 h-4 w-4" />
              Về trang chủ
            </Button>
            <Button
              onClick={() => navigate('/profile')}
              className="flex-1"
              size="lg"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Thử lại
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
