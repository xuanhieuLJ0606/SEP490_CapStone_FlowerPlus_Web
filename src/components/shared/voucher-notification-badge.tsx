import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tag } from 'lucide-react';
import { useGetMyPersonalVoucherCount } from '@/queries/personal-voucher.query';
import { Link } from 'react-router-dom';

export default function VoucherNotificationBadge() {
  const { data: countRes } = useGetMyPersonalVoucherCount();
  const voucherCount = countRes?.data || 0;

  if (voucherCount === 0) return null;

  return (
    <Link to="/profile?tab=vouchers">
      <Button variant="ghost" size="sm" className="relative">
        <Tag className="h-4 w-4" />
        <span className="ml-1 hidden sm:inline">Voucher</span>
        {voucherCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
          >
            {voucherCount > 99 ? '99+' : voucherCount}
          </Badge>
        )}
      </Button>
    </Link>
  );
}
