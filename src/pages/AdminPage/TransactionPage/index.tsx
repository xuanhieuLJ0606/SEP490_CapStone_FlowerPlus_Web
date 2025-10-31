import BasePages from '@/components/shared/base-pages.js';
import { OverViewTab } from './components/overview/index.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import __helpers from '@/helpers/index.js';
export default function TransactionPage() {
  return (
    <>
      <BasePages
        className="relative flex-1 space-y-4 overflow-y-auto  px-4"
        pageHead="Quản lý giao dịch"
        breadcrumbs={[
          { title: 'Trang chủ', link: '/' },
          { title: 'Quản lý giao dịch', link: '/admin/payment' }
        ]}
      >
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Danh sách giao dịch</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <OverViewTab />
          </TabsContent>
        </Tabs>
      </BasePages>
    </>
  );
}
