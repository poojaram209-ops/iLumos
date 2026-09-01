import { useState, useCallback } from 'react';
import { History, ChevronDown, ChevronUp } from 'lucide-react';
import type { ClaimElement, SourceDoc, ChatMessage, AISuggestion, Version } from '@/types';
import {
  INITIAL_CLAIM_ELEMENTS,
  INITIAL_SOURCES,
  INITIAL_VERSIONS,
  INITIAL_CHAT_INTRO,
  DEFAULT_AI_INSTRUCTIONS,
} from '@/data/mockData';
import SetupScreen from '@/components/SetupScreen';
import TopNav from '@/components/TopNav';
import ClaimChart from '@/components/ClaimChart';
import ChatPanel from '@/components/ChatPanel';
import SidePanel from '@/components/SidePanel';
import SourcesPanel from '@/components/SourcesPanel';
import InstructionsPanel from '@/components/InstructionsPanel';
import VersionHistory from '@/components/VersionHistory';
import Toast from '@/components/Toast';

type Screen = 'setup' | 'workspace';

export default function App() {
  const [screen, setScreen] = useState<Screen>('setup');
  const [elements, setElements] = useState<ClaimElement[]>(INITIAL_CLAIM_ELEMENTS);
  const [sources, setSources] = useState<SourceDoc[]>(INITIAL_SOURCES);
  const [instructions, setInstructions] = useState(DEFAULT_AI_INSTRUCTIONS);
  const [versions, setVersions] = useState<Version[]>(INITIAL_VERSIONS);
  const [currentVersionId, setCurrentVersionId] = useState(3);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-intro',
      role: 'ai',
      content: INITIAL_CHAT_INTRO,
      timestamp: Date.now(),
    },
  ]);
  const [selectedElementId, setSelectedElementId] = useState<number | null>(null);
  const [highlightedElementId, setHighlightedElementId] = useState<number | null>(null);
  const [lastAcceptedElementId, setLastAcceptedElementId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [versionPanelOpen, setVersionPanelOpen] = useState(false);

  // Panel state
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  const handleStart = () => {
    setScreen('workspace');
  };

  const handleAcceptSuggestion = useCallback(
    (suggestion: AISuggestion) => {
      setElements((prev) =>
        prev.map((el) =>
          el.id === suggestion.elementId
            ? {
                ...el,
                reasoning: suggestion.suggestedText,
                strength: suggestion.field === 'reasoning' && el.strength === 'Weak' ? 'Stronger' : el.strength === 'Weak' ? 'Moderate' : el.strength,
                updated: true,
              }
            : el
        )
      );

      setHighlightedElementId(suggestion.elementId);
      setTimeout(() => setHighlightedElementId(null), 2000);

      setLastAcceptedElementId(suggestion.elementId);

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-sys-${Date.now()}`,
          role: 'system',
          content: `Element ${suggestion.elementId} has been updated with the strengthened reasoning.`,
          timestamp: Date.now(),
        },
      ]);

      // Create new version
      const newVersion: Version = {
        id: versions.length + 1,
        label: `Refinement ${versions.length}`,
        elements: JSON.parse(JSON.stringify(elements.map((el) =>
          el.id === suggestion.elementId
            ? {
                ...el,
                reasoning: suggestion.suggestedText,
                strength: el.strength === 'Weak' ? 'Stronger' : el.strength,
                updated: true,
              }
            : el
        ))),
        timestamp: Date.now(),
      };
      setVersions((prev) => [...prev, newVersion]);
      setCurrentVersionId(newVersion.id);

      showToast(`Element ${suggestion.elementId} updated`);
    },
    [elements, versions, showToast]
  );

  const handleRejectSuggestion = useCallback(() => {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-sys-${Date.now()}`,
        role: 'system',
        content: 'Suggestion rejected. What would you like me to change?',
        timestamp: Date.now(),
      },
    ]);
  }, []);

  const handleModifySuggestion = useCallback(
    (suggestion: AISuggestion, newText: string) => {
      setElements((prev) =>
        prev.map((el) =>
          el.id === suggestion.elementId
            ? {
                ...el,
                reasoning: newText,
                strength: el.strength === 'Weak' ? 'Stronger' : el.strength,
                updated: true,
              }
            : el
        )
      );

      setHighlightedElementId(suggestion.elementId);
      setTimeout(() => setHighlightedElementId(null), 2000);
      setLastAcceptedElementId(suggestion.elementId);

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-sys-${Date.now()}`,
          role: 'system',
          content: `Element ${suggestion.elementId} has been updated with your modified reasoning.`,
          timestamp: Date.now(),
        },
      ]);

      const newVersion: Version = {
        id: versions.length + 1,
        label: `Refinement ${versions.length} (modified)`,
        elements: JSON.parse(JSON.stringify(elements.map((el) =>
          el.id === suggestion.elementId
            ? { ...el, reasoning: newText, strength: el.strength === 'Weak' ? 'Stronger' : el.strength, updated: true }
            : el
        ))),
        timestamp: Date.now(),
      };
      setVersions((prev) => [...prev, newVersion]);
      setCurrentVersionId(newVersion.id);

      showToast(`Element ${suggestion.elementId} updated`);
    },
    [elements, versions, showToast]
  );

  const handleRevert = useCallback(
    (versionId: number) => {
      const target = versions.find((v) => v.id === versionId);
      if (!target) return;

      const restored = target.elements.map((el) => ({ ...el, updated: false }));
      setElements(restored);
      setCurrentVersionId(versionId);

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-sys-${Date.now()}`,
          role: 'system',
          content: `Reverted to "${target.label}". The claim chart has been restored to this version.`,
          timestamp: Date.now(),
        },
      ]);

      showToast(`Reverted to ${target.label}`);
      setVersionPanelOpen(false);
    },
    [versions, showToast]
  );

  const handleExport = useCallback(
    (format: string) => {
      const label = format === 'docx' ? 'Word (.docx)' : format === 'pdf' ? 'PDF' : 'Excel';
      showToast(`Claim chart exported as ${label}`);
    },
    [showToast]
  );

  const handleAddSource = useCallback((doc: SourceDoc) => {
    setSources((prev) => [...prev, doc]);
  }, []);

  const handleSaveInstructions = useCallback(
    (newInstructions: string) => {
      setInstructions(newInstructions);
    },
    []
  );

  if (screen === 'setup') {
    return <SetupScreen onStart={handleStart} />;
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <TopNav
        onSources={() => setSourcesOpen(true)}
        onInstructions={() => setInstructionsOpen(true)}
        onExport={handleExport}
      />

      {/* Main workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Claim chart area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="mx-auto max-w-7xl px-6 py-6">
            {/* Workspace header */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Claim Chart</h2>
                <p className="text-sm text-slate-500">
                  4 claim elements · 2 supporting documents
                </p>
              </div>

              {/* Version control */}
              <button
                onClick={() => setVersionPanelOpen(!versionPanelOpen)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <History size={14} />
                Version {currentVersionId} — Current
                {versionPanelOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            {/* Version history dropdown */}
            {versionPanelOpen && (
              <div className="mb-4 rounded-xl border border-slate-200 bg-white shadow-lg animate-fade-in">
                <VersionHistory
                  versions={versions}
                  currentVersionId={currentVersionId}
                  onRevert={handleRevert}
                />
              </div>
            )}

            {/* Claim chart */}
            <ClaimChart
              elements={elements}
              selectedId={selectedElementId}
              onSelect={setSelectedElementId}
              highlightedId={highlightedElementId}
            />
          </div>
        </div>

        {/* Chat panel */}
        <div className="w-[400px] shrink-0 border-l border-slate-200">
          <ChatPanel
            messages={messages}
            setMessages={setMessages}
            elements={elements}
            onAcceptSuggestion={handleAcceptSuggestion}
            onRejectSuggestion={handleRejectSuggestion}
            onModifySuggestion={handleModifySuggestion}
            lastAcceptedElementId={lastAcceptedElementId}
          />
        </div>
      </div>

      {/* Side panels */}
      <SidePanel
        open={sourcesOpen}
        onClose={() => setSourcesOpen(false)}
        title="Sources"
        subtitle="Uploaded documents and evidence"
      >
        <SourcesPanel sources={sources} onAddSource={handleAddSource} />
      </SidePanel>

      <SidePanel
        open={instructionsOpen}
        onClose={() => setInstructionsOpen(false)}
        title="AI Instructions"
        subtitle="System instructions for claim analysis"
      >
        <InstructionsPanel instructions={instructions} onSave={handleSaveInstructions} />
      </SidePanel>

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
