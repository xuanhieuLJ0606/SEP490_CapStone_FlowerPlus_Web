import BasePages from '@/components/shared/base-pages';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OverViewTab } from './list/overview';
import { AddFlowerForm } from './list/add-form';

export default function FlowersPage() {
  return (
    <>
      <BasePages
        className="relative flex-1 space-y-4 overflow-y-auto  px-4"
        pageHead="Quản lý Flowers"
        breadcrumbs={[
          { title: 'Trang chủ', link: '/' },
          { title: 'Quản lý Flowers', link: '/admin/flowers' }
        ]}
      >
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Danh sách</TabsTrigger>
            <TabsTrigger value="add">Thêm mới</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <OverViewTab />
          </TabsContent>
          <TabsContent value="add" className="space-y-4">
            <AddFlowerForm />
          </TabsContent>
        </Tabs>
      </BasePages>
    </>
  );
}
