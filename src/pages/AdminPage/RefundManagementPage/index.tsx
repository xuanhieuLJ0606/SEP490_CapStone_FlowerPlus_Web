import BasePages from '@/components/shared/base-pages';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OverViewTab } from './components/overview';

export default function RefundManagementPage() {
  return (
    <BasePages
      className="relative flex-1 space-y-4 overflow-y-auto px-4"
      pageHead="Quản lý hoàn tiền"
      breadcrumbs={[
        { title: 'Trang chủ', link: '/' },
        { title: 'Quản lý hoàn tiền', link: '/admin/refunds' }
      ]}
    >
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            Danh sách yêu cầu hoàn tiền
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <OverViewTab />
        </TabsContent>
      </Tabs>
    </BasePages>
  );
}
