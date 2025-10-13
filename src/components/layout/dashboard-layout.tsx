import __helpers from '@/helpers';
import FloatingContactButtons from '../ui/FloatingContact';
import Header from './header';
import Footer from './footer';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />

      <div className="h-full min-h-screen  ">
        <main className="w-full">{children}</main>
        <FloatingContactButtons />
      </div>
      <Footer />
    </div>
  );
}
