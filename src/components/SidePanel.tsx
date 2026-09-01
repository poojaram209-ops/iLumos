import { type ReactNode } from 'react';
import { X } from 'lucide-react';

interface SidePanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  width?: string;
  side?: 'right' | 'left';
}

export default function SidePanel({
  open,
  onClose,
  title,
  subtitle,
  children,
  width = 'max-w-md',
  side = 'right',
}: SidePanelProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40">
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={`absolute top-0 ${side === 'right' ? 'right-0' : 'left-0'} h-full w-full ${width} bg-white shadow-2xl ${
          side === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'
        } flex flex-col`}
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">{children}</div>
      </div>
    </div>
  );
}
