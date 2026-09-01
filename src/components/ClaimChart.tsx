import { type ClaimElement, type EvidenceStrength } from '@/types';
import { AlertTriangle, Check, Minus, Circle } from 'lucide-react';

interface ClaimChartProps {
  elements: ClaimElement[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  highlightedId: number | null;
}

const strengthConfig: Record<EvidenceStrength, { dot: string; badge: string; icon: typeof Check }> = {
  Strong: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: Check,
  },
  Stronger: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: Check,
  },
  Moderate: {
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Minus,
  },
  Weak: {
    dot: 'bg-red-400',
    badge: 'bg-red-50 text-red-700 border-red-200',
    icon: AlertTriangle,
  },
};

export default function ClaimChart({ elements, selectedId, onSelect, highlightedId }: ClaimChartProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Header row */}
      <div className="grid grid-cols-[1fr_1.2fr_1.4fr_auto] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Claim Element</h3>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Evidence</h3>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">AI Reasoning</h3>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 w-20 text-right">Status</h3>
      </div>

      {/* Rows */}
      <div>
        {elements.map((el) => {
          const cfg = strengthConfig[el.strength];
          const StrengthIcon = cfg.icon;
          const isSelected = selectedId === el.id;
          const isHighlighted = highlightedId === el.id;

          return (
            <div
              key={el.id}
              onClick={() => onSelect(el.id)}
              className={`grid cursor-pointer grid-cols-[1fr_1.2fr_1.4fr_auto] gap-4 border-b border-slate-100 px-5 py-4 transition-colors hover:bg-slate-50/80 ${
                isSelected ? 'bg-blue-50/60' : ''
              } ${isHighlighted ? 'animate-row-highlight' : ''}`}
            >
              {/* Claim Element */}
              <div className="flex gap-2.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-semibold text-slate-500">
                  {el.id}
                </div>
                <p className="text-sm leading-relaxed text-slate-800">{el.claim}</p>
              </div>

              {/* Evidence */}
              <div className="flex gap-2">
                <Circle size={8} className={`mt-1.5 shrink-0 ${cfg.dot} fill-current`} />
                <p className="text-sm leading-relaxed text-slate-600">{el.evidence}</p>
              </div>

              {/* AI Reasoning */}
              <div className="relative">
                <p className={`text-sm leading-relaxed ${el.updated ? 'text-emerald-800' : 'text-slate-600'}`}>
                  {el.reasoning}
                </p>
                {el.updated && (
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    <Check size={10} />
                    Updated
                  </span>
                )}
              </div>

              {/* Status */}
              <div className="flex w-20 justify-end">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${cfg.badge}`}
                >
                  <StrengthIcon size={11} />
                  {el.strength}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
