import __helpers from '@/helpers';
import FloatingContactButtons from '../ui/FloatingContact';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full min-h-screen  ">
      <main className="w-full">{children}</main>
      <FloatingContactButtons />
    </div>
  );
}
