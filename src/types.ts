export type EvidenceStrength = 'Strong' | 'Moderate' | 'Weak' | 'Stronger';

export interface ClaimElement {
  id: number;
  claim: string;
  evidence: string;
  reasoning: string;
  strength: EvidenceStrength;
  updated?: boolean;
}

export interface SourceDoc {
  id: string;
  name: string;
  type: string;
  pages: number;
  usedByAI: boolean;
  sections: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  suggestion?: AISuggestion;
  timestamp: number;
}

export interface AISuggestion {
  elementId: number;
  field: 'reasoning' | 'evidence';
  originalText: string;
  suggestedText: string;
  source: string;
  confidence: 'High' | 'Medium' | 'Low';
}

export interface Version {
  id: number;
  label: string;
  elements: ClaimElement[];
  timestamp: number;
}
