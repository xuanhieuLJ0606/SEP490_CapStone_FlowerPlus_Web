import { AlertModal } from '@/components/shared/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { PersonalVoucher } from './columns';
import { MoreHorizontal, Trash } from 'lucide-react';
import { useState } from 'react';
import { useDeletePersonalVoucher } from '@/queries/personal-voucher.query';
import { toast } from 'sonner';

interface CellActionProps {
  data: PersonalVoucher;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const deletePersonalVoucher = useDeletePersonalVoucher();

  const onConfirm = async () => {
    try {
      setLoading(true);
      await deletePersonalVoucher.mutateAsync(data.userVoucherId);
      toast.success('Voucher cá nhân đã được vô hiệu hóa');
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.message || 'Có lỗi xảy ra khi vô hiệu hóa voucher');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title="Vô hiệu hóa voucher cá nhân"
        description="Bạn có chắc chắn muốn vô hiệu hóa voucher này? Hành động này không thể hoàn tác."
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Mở menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>

          {!data.isUsed && (
            <DropdownMenuItem
              onClick={() => setOpen(true)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" /> Vô hiệu hóa
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
