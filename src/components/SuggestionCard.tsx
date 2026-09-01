import { type AISuggestion } from '@/types';
import { FileText, Check, X, Pencil, Save } from 'lucide-react';
import { useState } from 'react';

interface SuggestionCardProps {
  suggestion: AISuggestion;
  onAccept: () => void;
  onReject: () => void;
  onModify: (newText: string) => void;
}

export default function SuggestionCard({ suggestion, onAccept, onReject, onModify }: SuggestionCardProps) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(suggestion.suggestedText);

  const confidenceColor =
    suggestion.confidence === 'High'
      ? 'bg-emerald-100 text-emerald-700'
      : suggestion.confidence === 'Medium'
      ? 'bg-amber-100 text-amber-700'
      : 'bg-slate-100 text-slate-600';

  return (
    <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4 animate-fade-in">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-600">
          <Sparkles size={11} className="text-white" />
        </div>
        <h4 className="text-sm font-semibold text-slate-900">
          Suggested {suggestion.field === 'reasoning' ? 'reasoning' : 'evidence'}
        </h4>
        <span className="ml-auto text-xs font-medium text-slate-400">
          Element {suggestion.elementId}
        </span>
      </div>

      {editing ? (
        <div>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={5}
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          />
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => {
                onModify(editText);
                setEditing(false);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              <Save size={12} />
              Save modification
            </button>
            <button
              onClick={() => {
                setEditText(suggestion.suggestedText);
                setEditing(false);
              }}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm leading-relaxed text-slate-700">{suggestion.suggestedText}</p>

          {/* Source */}
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2">
            <FileText size={13} className="text-slate-400" />
            <span className="text-xs font-medium text-slate-600">{suggestion.source}</span>
          </div>

          {/* Confidence + Actions */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Confidence:</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${confidenceColor}`}>
                {suggestion.confidence}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onAccept}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
              >
                <Check size={12} />
                Accept
              </button>
              <button
                onClick={onReject}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <X size={12} />
                Reject
              </button>
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Pencil size={12} />
                Modify
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Inline Sparkles icon to avoid extra import noise
function Sparkles({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3z" />
    </svg>
  );
}
