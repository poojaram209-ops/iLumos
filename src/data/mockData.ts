import type { ClaimElement, SourceDoc, Version } from '@/types';

export const DEFAULT_AI_INSTRUCTIONS =
  'Analyze each claim element against the available evidence. Prioritize technically specific evidence, identify gaps, explain your reasoning clearly, and cite the supporting source whenever possible. Do not assume evidence that is not present in the uploaded materials.';

export const INITIAL_CLAIM_ELEMENTS: ClaimElement[] = [
  {
    id: 1,
    claim: 'A system comprising a machine learning model configured to process input data',
    evidence:
      'Product documentation describes a machine learning model that processes incoming feature data before generating predictions.',
    reasoning:
      'The documentation directly identifies an ML model and describes its role in processing input data. Evidence is relevant, but the implementation details could be strengthened.',
    strength: 'Moderate',
  },
  {
    id: 2,
    claim:
      'The machine learning model comprises a neural network configured to perform classification',
    evidence:
      'The ML architecture document identifies a neural network-based classification pipeline.',
    reasoning:
      'The evidence supports the presence of a neural network and classification functionality. Additional technical details about the network architecture would strengthen the mapping.',
    strength: 'Moderate',
  },
  {
    id: 3,
    claim:
      'The neural network includes an attention mechanism configured to determine relationships between input features',
    evidence:
      'Architecture documentation references attention-based processing within the model.',
    reasoning:
      'The evidence suggests attention-based processing, but does not clearly explain how the mechanism determines relationships between input features.',
    strength: 'Weak',
  },
  {
    id: 4,
    claim: 'The system generates an output based on the processed input data',
    evidence:
      'The product specification states that the model generates predictions from processed input features.',
    reasoning:
      'The evidence directly connects processed input data to the generated prediction output.',
    strength: 'Strong',
  },
];

export const INITIAL_SOURCES: SourceDoc[] = [
  {
    id: 'doc-1',
    name: 'Product_Technical_Spec.pdf',
    type: 'PDF',
    pages: 42,
    usedByAI: true,
    sections: [
      'Section 2.1 — System overview',
      'Section 3.4 — Input data processing',
      'Section 6.0 — Prediction output',
    ],
  },
  {
    id: 'doc-2',
    name: 'ML_Architecture_Document.pdf',
    type: 'PDF',
    pages: 68,
    usedByAI: true,
    sections: [
      'Section 4.2 — Attention mechanism',
      'Section 5.1 — Classification pipeline',
    ],
  },
];

export const INITIAL_VERSIONS: Version[] = [
  {
    id: 1,
    label: 'Original chart',
    elements: JSON.parse(JSON.stringify(INITIAL_CLAIM_ELEMENTS)),
    timestamp: Date.now() - 7200000,
  },
  {
    id: 2,
    label: 'Refinement 1',
    elements: JSON.parse(
      JSON.stringify([
        ...INITIAL_CLAIM_ELEMENTS.slice(0, 1),
        {
          ...INITIAL_CLAIM_ELEMENTS[1],
          reasoning:
            'The ML architecture document identifies a multi-layer neural network with softmax output for classification, confirming the neural network classification pipeline.',
          strength: 'Strong' as const,
        },
        ...INITIAL_CLAIM_ELEMENTS.slice(2),
      ])
    ),
    timestamp: Date.now() - 3600000,
  },
  {
    id: 3,
    label: 'Refinement 2',
    elements: JSON.parse(
      JSON.stringify([
        ...INITIAL_CLAIM_ELEMENTS.slice(0, 1),
        {
          ...INITIAL_CLAIM_ELEMENTS[1],
          reasoning:
            'The ML architecture document identifies a multi-layer neural network with softmax output for classification, confirming the neural network classification pipeline.',
          strength: 'Strong' as const,
        },
        ...INITIAL_CLAIM_ELEMENTS.slice(2),
      ])
    ),
    timestamp: Date.now() - 1800000,
  },
];

export const INITIAL_CHAT_INTRO =
  'Your claim chart has been analyzed. I found strong support for Elements 1 and 4, moderate support for Element 2, and a potential evidence gap in Element 3. You can ask me to strengthen evidence, improve reasoning, or identify missing technical details.';

export const SUGGESTED_PROMPTS = [
  'Strengthen weak evidence',
  'Improve reasoning',
  'Find missing features',
  'Review entire chart',
];

export const SAMPLE_FILES = [
  { name: 'Product_Technical_Spec.pdf', type: 'PDF', size: '2.4 MB' },
  { name: 'ML_Architecture_Document.pdf', type: 'PDF', size: '5.1 MB' },
];
