import { useState } from 'react';
import { FileText, Upload, CheckCircle2, BookOpen } from 'lucide-react';
import { type SourceDoc } from '@/types';

interface SourcesPanelProps {
  sources: SourceDoc[];
  onAddSource: (doc: SourceDoc) => void;
}

export default function SourcesPanel({ sources, onAddSource }: SourcesPanelProps) {
  const [showUpload, setShowUpload] = useState(false);

  const mockNewDocs = [
    { name: 'Patent_US10234567.pdf', type: 'PDF', pages: 34, sections: ['Section 1 — Claims', 'Section 3 — Specification'] },
    { name: 'Infringer_Product_Datasheet.pdf', type: 'PDF', pages: 12, sections: ['Section 2 — Model architecture'] },
    { name: 'API_Documentation.docx', type: 'DOCX', pages: 28, sections: ['Section 5 — Inference pipeline'] },
  ];

  const addMockDoc = () => {
    const available = mockNewDocs.find((d) => !sources.some((s) => s.name === d.name));
    if (available) {
      onAddSource({
        id: `doc-${Date.now()}`,
        name: available.name,
        type: available.type,
        pages: available.pages,
        usedByAI: false,
        sections: available.sections,
      });
    }
    setShowUpload(false);
  };

  return (
    <div className="p-5 space-y-4">
      {sources.map((doc) => (
        <div key={doc.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
              <FileText size={18} className="text-slate-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{doc.name}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                <span>{doc.type}</span>
                <span>·</span>
                <span>{doc.pages} pages</span>
                {doc.usedByAI && (
                  <>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 size={11} />
                      Used by AI
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {doc.sections.length > 0 && (
            <div className="mt-3 border-t border-slate-100 pt-3">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <BookOpen size={12} />
                Relevant sections
              </p>
              <ul className="space-y-1.5">
                {doc.sections.map((section) => (
                  <li key={section} className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="h-1 w-1 rounded-full bg-blue-400" />
                    {section}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}

      {/* Upload area */}
      {showUpload ? (
        <div className="rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/50 p-6 text-center">
          <Upload size={20} className="mx-auto text-blue-500" />
          <p className="mt-2 text-sm font-medium text-slate-700">Drop a document here</p>
          <p className="mt-0.5 text-xs text-slate-400">PDF, DOCX, XLSX up to 50MB</p>
          <button
            onClick={addMockDoc}
            className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Add sample document
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowUpload(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600 transition-colors"
        >
          <Upload size={15} />
          Upload another document
        </button>
      )}
    </div>
  );
}
