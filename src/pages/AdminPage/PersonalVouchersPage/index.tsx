import BasePages from '@/components/shared/base-pages.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreatePersonalVoucher from './components/create/index.js';
import CreateBulkVouchers from './components/create-bulk/index.js';
import { OverViewTab } from './components/overview/index.js';

export default function PersonalVouchersPage() {
  return (
    <>
      <BasePages
        className="relative flex-1 space-y-4 overflow-y-auto px-4"
        pageHead="Quản lý voucher cá nhân"
        breadcrumbs={[
          { title: 'Trang chủ', link: '/' },
          { title: 'Quản lý voucher cá nhân', link: '/admin/personal-vouchers' }
        ]}
      >
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">
              Danh sách voucher cá nhân
            </TabsTrigger>
            <TabsTrigger value="create">Tạo voucher cá nhân</TabsTrigger>
            <TabsTrigger value="bulk">Tạo hàng loạt</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <OverViewTab />
          </TabsContent>
          <TabsContent value="create" className="space-y-4">
            <CreatePersonalVoucher />
          </TabsContent>
          <TabsContent value="bulk" className="space-y-4">
            <CreateBulkVouchers />
          </TabsContent>
        </Tabs>
      </BasePages>
    </>
  );
}
