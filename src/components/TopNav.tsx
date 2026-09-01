import { Sparkles, FileStack, SlidersHorizontal, Download, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface TopNavProps {
  onSources: () => void;
  onInstructions: () => void;
  onExport: (format: string) => void;
}

export default function TopNav({ onSources, onInstructions, onExport }: TopNavProps) {
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const exportOptions = [
    { label: 'Word (.docx)', value: 'docx' },
    { label: 'PDF', value: 'pdf' },
    { label: 'Excel', value: 'xlsx' },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Left — Logo */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <Sparkles size={16} className="text-white" />
        </div>
        <span className="text-base font-bold tracking-tight text-slate-900">iLumOS</span>
      </div>

      {/* Center — Project name */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <span className="text-sm font-medium text-slate-600">
          Patent Infringement Analysis — ML System
        </span>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={onSources}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <FileStack size={15} />
          Sources
        </button>
        <button
          onClick={onInstructions}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <SlidersHorizontal size={15} />
          AI Instructions
        </button>

        {/* Export dropdown */}
        <div ref={exportRef} className="relative">
          <button
            onClick={() => setExportOpen(!exportOpen)}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Download size={15} />
            Export
            <ChevronDown size={13} className={`transition-transform ${exportOpen ? 'rotate-180' : ''}`} />
          </button>
          {exportOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg animate-fade-in">
              <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Export Claim Chart
              </p>
              {exportOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onExport(opt.value);
                    setExportOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
          PA
        </div>
      </div>
    </header>
  );
}
