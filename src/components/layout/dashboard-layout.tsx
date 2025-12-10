import __helpers from '@/helpers';
import FloatingContactButtons from '../ui/FloatingContact';
import Header from './header';
import Footer from './footer';
import Chatbot from '../shared/chatbot';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />

      <div className="h-full min-h-[90%]">
        <main className="w-full">{children}</main>
        <FloatingContactButtons />
        <Chatbot />
      </div>
      <Footer />
    </div>
  );
}
