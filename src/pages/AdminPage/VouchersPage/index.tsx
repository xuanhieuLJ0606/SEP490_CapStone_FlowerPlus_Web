import BasePages from '@/components/shared/base-pages.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Add from './components/add/index.js';
import __helpers from '@/helpers/index.js';
import { OverViewTab } from './components/overview/index.js';
export default function VouchersPage() {
  return (
    <>
      <BasePages
        className="relative flex-1 space-y-4 overflow-y-auto  px-4"
        pageHead="Quản lý plan"
        breadcrumbs={[
          { title: 'Trang chủ', link: '/' },
          { title: 'Quản lý vouchers', link: '/admin/vouchers' }
        ]}
      >
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Danh sách vouchers</TabsTrigger>
            <TabsTrigger value="add">Thêm voucher</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <OverViewTab />
          </TabsContent>
          <TabsContent value="add" className="space-y-4">
            <Add />
          </TabsContent>
        </Tabs>
      </BasePages>
    </>
  );
}
