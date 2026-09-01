import { type Version } from '@/types';
import { History, RotateCcw, Check } from 'lucide-react';

interface VersionHistoryProps {
  versions: Version[];
  currentVersionId: number;
  onRevert: (versionId: number) => void;
}

export default function VersionHistory({ versions, currentVersionId, onRevert }: VersionHistoryProps) {
  const reversed = [...versions].reverse();

  return (
    <div className="p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        <History size={13} />
        Version History
      </div>

      <div className="space-y-1.5">
        {reversed.map((version, idx) => {
          const isCurrent = version.id === currentVersionId;
          const isPrevious = idx === 1;

          return (
            <div
              key={version.id}
              className={`rounded-xl border px-4 py-3 ${
                isCurrent
                  ? 'border-blue-200 bg-blue-50/60'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              } transition-colors`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold ${
                      isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isCurrent ? <Check size={13} /> : version.id}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{version.label}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(version.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {isCurrent ? (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                    Current
                  </span>
                ) : isPrevious ? (
                  <button
                    onClick={() => onRevert(version.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                  >
                    <RotateCcw size={11} />
                    Revert
                  </button>
                ) : (
                  <button
                    onClick={() => onRevert(version.id)}
                    className="text-xs font-medium text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    Restore
                  </button>
                )}
              </div>

              {/* Mini preview */}
              <div className="mt-2.5 space-y-1">
                {version.elements.slice(0, 4).map((el) => (
                  <div key={el.id} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                    <span className="text-xs text-slate-500 truncate">
                      Element {el.id} — {el.strength}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
