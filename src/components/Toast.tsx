import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-toast">
      <div className="flex items-center gap-2.5 rounded-xl bg-emerald-600 px-4 py-3 shadow-lg">
        <CheckCircle2 size={18} className="text-white" />
        <span className="text-sm font-medium text-white">{message}</span>
      </div>
    </div>
  );
}
