import { useState } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { DEFAULT_AI_INSTRUCTIONS } from '@/data/mockData';

interface InstructionsPanelProps {
  instructions: string;
  onSave: (instructions: string) => void;
}

export default function InstructionsPanel({ instructions, onSave }: InstructionsPanelProps) {
  const [text, setText] = useState(instructions);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(text);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex h-full flex-col p-5">
      <p className="mb-4 text-sm text-slate-500">
        These instructions guide how the AI analyzes and refines your claim chart. Edit them to tune the AI's behavior.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={12}
        className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
      />

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setText(DEFAULT_AI_INSTRUCTIONS)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
        >
          <RotateCcw size={12} />
          Reset to default
        </button>

        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-xs font-medium text-emerald-600 animate-fade-in">
              AI instructions updated
            </span>
          )}
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            <Save size={13} />
            Save Instructions
          </button>
        </div>
      </div>
    </div>
  );
}
