import { MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FloatingElements() {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 sm:bottom-6 sm:right-6 sm:space-y-4">
      {/* Zalo Chat */}
      <Button
        size="icon"
        className="h-12 w-12 rounded-full bg-blue-500 shadow-lg hover:bg-blue-600 sm:h-14 sm:w-14"
      >
        <MessageCircle className="h-5 w-5 text-white sm:h-6 sm:w-6" />
      </Button>

      {/* Phone Call */}
      <Button
        size="icon"
        className="h-12 w-12 rounded-full bg-red-500 shadow-lg hover:bg-red-600 sm:h-14 sm:w-14"
      >
        <Phone className="h-5 w-5 text-white sm:h-6 sm:w-6" />
      </Button>
    </div>
  );
}
