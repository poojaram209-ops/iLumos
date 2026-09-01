import { useState } from 'react';
import {
  Upload,
  FileText,
  X,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  FileUp,
} from 'lucide-react';
import { DEFAULT_AI_INSTRUCTIONS, SAMPLE_FILES } from '@/data/mockData';

interface SetupFile {
  name: string;
  type: string;
  size: string;
}

interface SetupScreenProps {
  onStart: () => void;
}

export default function SetupScreen({ onStart }: SetupScreenProps) {
  const [files, setFiles] = useState<SetupFile[]>(
    SAMPLE_FILES.map((f) => ({ ...f }))
  );
  const [instructions, setInstructions] = useState(DEFAULT_AI_INSTRUCTIONS);
  const [claimChartUploaded, setClaimChartUploaded] = useState(true);
  const [dragOver, setDragOver] = useState(false);

  const removeFile = (name: string) => {
    setFiles(files.filter((f) => f.name !== name));
  };

  const addMockFile = () => {
    const mockNames = [
      'Patent_US10234567.pdf',
      'Competitor_Analysis.docx',
      'Technical_Standards_Overview.pdf',
    ];
    const available = mockNames.find((n) => !files.some((f) => f.name === n));
    if (available) {
      setFiles([
        ...files,
        { name: available, type: available.endsWith('.pdf') ? 'PDF' : 'DOCX', size: '1.8 MB' },
      ]);
    }
  };

  const resetInstructions = () => {
    setInstructions(DEFAULT_AI_INSTRUCTIONS);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">iLumOS</h1>
              <p className="text-xs text-slate-500">AI-powered claim chart analysis & refinement</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Start a new claim analysis</h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Upload your claim chart and supporting documents to begin AI-assisted refinement.
          </p>
        </div>

        <div className="space-y-5">
          {/* 1. Claim Chart Upload */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                1
              </span>
              <h3 className="text-sm font-semibold text-slate-900">Claim Chart</h3>
            </div>

            {claimChartUploaded ? (
              <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                    <FileText size={18} className="text-emerald-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Sample_Claim_Chart.xlsx</p>
                    <p className="text-xs text-emerald-700">Uploaded — sample claim chart loaded</p>
                  </div>
                </div>
                <button
                  onClick={() => setClaimChartUploaded(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div
                className={`rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
                  dragOver ? 'border-blue-400 bg-blue-50' : 'border-slate-300 bg-slate-50'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  setClaimChartUploaded(true);
                }}
              >
                <Upload size={24} className="mx-auto text-slate-400" />
                <p className="mt-2 text-sm font-medium text-slate-700">Upload claim chart</p>
                <p className="mt-0.5 text-xs text-slate-400">Supported formats: DOCX, XLSX, PDF</p>
              </div>
            )}

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => setClaimChartUploaded(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FileUp size={13} />
                Use sample claim chart
              </button>
            </div>
          </section>

          {/* 2. Supporting Documents */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                2
              </span>
              <h3 className="text-sm font-semibold text-slate-900">Product & Technical Documentation</h3>
            </div>
            <p className="mb-4 text-xs text-slate-500">
              Upload product specifications, technical documentation, manuals, patents, or other evidence sources.
            </p>

            <div className="space-y-2.5">
              {files.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-slate-200">
                      <FileText size={16} className="text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{file.name}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{file.type}</span>
                        <span>·</span>
                        <span>{file.size}</span>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1 text-emerald-600">
                          <CheckCircle2 size={11} />
                          Uploaded
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file.name)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}

              <button
                onClick={addMockFile}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-4 py-3 text-xs font-medium text-slate-500 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600 transition-colors"
              >
                <Upload size={14} />
                Upload another document
              </button>
            </div>
          </section>

          {/* 3. AI Instructions */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                3
              </span>
              <h3 className="text-sm font-semibold text-slate-900">AI Analysis Instructions</h3>
            </div>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={5}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
            <button
              onClick={resetInstructions}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
              <RotateCcw size={12} />
              Reset to default
            </button>
          </section>

          {/* CTA */}
          <button
            onClick={onStart}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all hover:shadow-md"
          >
            Start Analysis
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </main>
    </div>
  );
}
