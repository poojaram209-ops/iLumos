import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  FileText,
} from 'lucide-react';
import { type ChatMessage, type ClaimElement, type AISuggestion } from '@/types';
import { getAIResponse } from '@/data/aiResponses';
import { SUGGESTED_PROMPTS } from '@/data/mockData';
import SuggestionCard from './SuggestionCard';

interface ChatPanelProps {
  messages: ChatMessage[];
  setMessages: (updater: (prev: ChatMessage[]) => ChatMessage[]) => void;
  elements: ClaimElement[];
  onAcceptSuggestion: (suggestion: AISuggestion) => void;
  onRejectSuggestion: () => void;
  onModifySuggestion: (suggestion: AISuggestion, newText: string) => void;
  lastAcceptedElementId: number | null;
}

export default function ChatPanel({
  messages,
  setMessages,
  elements,
  onAcceptSuggestion,
  onRejectSuggestion,
  onModifySuggestion,
  lastAcceptedElementId,
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setThinking(true);

    setTimeout(() => {
      const response = getAIResponse(text, elements, lastAcceptedElementId);
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'ai',
        content: response.content,
        suggestion: response.suggestion,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setThinking(false);
    }, 1200);
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-slate-200 px-5 py-3.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <Sparkles size={15} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">iLumOS AI</h3>
          <p className="text-xs text-slate-500">Claim analysis assistant</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4 space-y-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} onAccept={onAcceptSuggestion} onReject={onRejectSuggestion} onModify={onModifySuggestion} />
        ))}

        {thinking && (
          <div className="flex items-center gap-2 text-slate-400">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
              <Sparkles size={14} className="text-slate-400" />
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-slate-300 animate-pulse-subtle" style={{ animationDelay: '0ms' }} />
              <span className="h-2 w-2 rounded-full bg-slate-300 animate-pulse-subtle" style={{ animationDelay: '200ms' }} />
              <span className="h-2 w-2 rounded-full bg-slate-300 animate-pulse-subtle" style={{ animationDelay: '400ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Suggested prompts */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 px-5 pb-2">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => sendMessage(prompt)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Ask AI to refine, strengthen, or review…"
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({
  message,
  onAccept,
  onReject,
  onModify,
}: {
  message: ChatMessage;
  onAccept: (s: AISuggestion) => void;
  onReject: () => void;
  onModify: (s: AISuggestion, newText: string) => void;
}) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="max-w-[85%] rounded-xl rounded-br-md bg-blue-600 px-4 py-2.5 text-sm leading-relaxed text-white">
          {message.content}
        </div>
      </div>
    );
  }

  if (message.role === 'system') {
    return (
      <div className="flex justify-center animate-fade-in">
        <div className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
          {message.content}
        </div>
      </div>
    );
  }

  // AI message
  return (
    <div className="flex gap-2.5 animate-fade-in">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
        <Sparkles size={14} className="text-blue-600" />
      </div>
      <div className="max-w-[90%]">
        <div className="rounded-xl rounded-tl-md bg-slate-50 px-4 py-3">
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{message.content}</p>
        </div>
        {message.suggestion && (
          <SuggestionCard
            suggestion={message.suggestion}
            onAccept={() => onAccept(message.suggestion!)}
            onReject={onReject}
            onModify={(newText) => onModify(message.suggestion!, newText)}
          />
        )}
      </div>
    </div>
  );
}
