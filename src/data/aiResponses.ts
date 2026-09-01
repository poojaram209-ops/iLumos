import type { AISuggestion, ClaimElement } from '@/types';

interface AIResponse {
  content: string;
  suggestion?: AISuggestion;
}

export function getAIResponse(
  message: string,
  elements: ClaimElement[],
  lastAcceptedElementId: number | null
): AIResponse {
  const lower = message.toLowerCase();

  // The primary demo interaction
  if (
    (lower.includes('weak') || lower.includes('reasoning')) &&
    (lower.includes('element 3') || lower.includes('ml algorithm') || lower.includes('attention') || lower.includes('element'))
  ) {
    return {
      content:
        "Element 3 needs more technically specific reasoning. Based on the uploaded ML Architecture Document, the attention mechanism is described as computing relationships between feature representations before the classification stage.\n\nI recommend strengthening the reasoning to:\n\n'The architecture uses an attention mechanism to assign different weights to input feature representations based on their contextual relationships. This supports the claim limitation requiring the system to determine relationships between input features before producing the downstream classification output.'\n\nSource: ML_Architecture_Document.pdf, Section 4.2",
      suggestion: {
        elementId: 3,
        field: 'reasoning',
        originalText: elements[2]?.reasoning ?? '',
        suggestedText:
          'The architecture uses an attention mechanism to assign different weights to input feature representations based on their contextual relationships. This supports the claim limitation requiring the system to determine relationships between input features before producing the downstream classification output.',
        source: 'ML_Architecture_Document.pdf — Section 4.2',
        confidence: 'High',
      },
    };
  }

  if (lower.includes('strengthen weak evidence') || (lower.includes('strengthen') && lower.includes('evidence'))) {
    return {
      content:
        "Element 3 has the weakest evidence mapping. The current evidence only references 'attention-based processing' without technical specifics. I recommend updating the evidence to cite the attention weight computation described in Section 4.2 of the ML Architecture Document, which directly addresses how relationships between input features are determined.\n\nWould you like me to draft a strengthened evidence statement for Element 3?",
    };
  }

  if (lower.includes('improve reasoning') || lower.includes('more technically precise') || lower.includes('technically precise')) {
    return {
      content:
        "I can make the reasoning more technically precise. For Element 3, the current reasoning is vague about how the attention mechanism works. Based on the ML Architecture Document (Section 4.2), the attention mechanism computes weighted relationships across feature representations using a scaled dot-product approach before classification.\n\nI suggest updating the reasoning to explicitly reference the attention weight computation and its role in determining inter-feature relationships.",
      suggestion: {
        elementId: 3,
        field: 'reasoning',
        originalText: elements[2]?.reasoning ?? '',
        suggestedText:
          'The architecture uses an attention mechanism to assign different weights to input feature representations based on their contextual relationships. This supports the claim limitation requiring the system to determine relationships between input features before producing the downstream classification output.',
        source: 'ML_Architecture_Document.pdf — Section 4.2',
        confidence: 'High',
      },
    };
  }

  if (lower.includes('find missing feature') || lower.includes('missing feature')) {
    return {
      content:
        "After reviewing all four claim elements against the uploaded documents, I identified the following gaps:\n\n• Element 3 — No evidence explicitly describes how the attention mechanism determines relationships between input features. The architecture document discusses attention weights but does not clearly map to the 'determine relationships' limitation.\n• Element 1 — The evidence mentions 'processing input data' but does not specify the preprocessing pipeline (normalization, feature extraction) described in Section 3.4 of the Product Technical Spec.\n\nElements 2 and 4 have sufficient evidentiary support.",
    };
  }

  if (lower.includes('review entire chart') || lower.includes('review') && lower.includes('chart')) {
    return {
      content:
        "Here's my overall assessment of the claim chart:\n\n• Element 1 (ML model processing input data) — Moderate support. Evidence confirms the model but lacks implementation detail.\n• Element 2 (Neural network classification) — Moderate support. Architecture document confirms the pipeline but could be more specific.\n• Element 3 (Attention mechanism for feature relationships) — Weak support. This is the primary gap — the evidence does not clearly address how relationships between features are determined.\n• Element 4 (Output generation) — Strong support. Direct evidence linking processed input to prediction output.\n\nI recommend focusing refinement efforts on Element 3 first, as it has the highest risk of being challenged.",
    };
  }

  if (lower.includes('which document') || lower.includes('show me exactly') || lower.includes('what document')) {
    return {
      content:
        "The evidence for Element 3 is supported by:\n\n• ML_Architecture_Document.pdf — Section 4.2 (Attention mechanism): Describes the attention weight computation across feature representations.\n• ML_Architecture_Document.pdf — Section 5.1 (Classification pipeline): Shows how attention outputs feed into the downstream classifier.\n\nThe Product_Technical_Spec.pdf does not contain specific details about the attention mechanism — it only references the general model architecture.",
    };
  }

  if (lower.includes('what evidence is still missing') || lower.includes('evidence is still missing') || lower.includes('still missing')) {
    return {
      content:
        "The primary evidence gap is in Element 3. While the ML Architecture Document references attention-based processing, it does not explicitly describe:\n\n1. How the attention mechanism determines relationships between specific input features\n2. The specific weighting or scoring methodology used\n3. Whether the relationships are computed before or during classification\n\nAdditionally, Element 1 could benefit from evidence describing the specific input preprocessing pipeline (feature extraction, normalization) referenced in Section 3.4 of the Product Technical Spec.",
    };
  }

  if (lower.includes('revert') || lower.includes('undo') || lower.includes('roll back')) {
    return {
      content:
        lastAcceptedElementId !== null
          ? `I can revert the most recent change to Element ${lastAcceptedElementId}. This will restore the previous reasoning text and evidence strength. Use the Version history panel to select a previous version, or click 'Revert to previous version' to undo the last refinement.`
          : "There are no recent changes to revert. The claim chart is currently at its latest version. You can view previous versions in the Version history panel.",
    };
  }

  if (lower.includes('export')) {
    return {
      content:
        "You can export the claim chart using the Export button in the top navigation. The chart can be exported as Word (.docx), PDF, or Excel format. The exported file will include all claim elements, evidence, reasoning, and strength indicators.",
    };
  }

  return {
    content:
      "I can help you refine this claim chart. You can ask me to:\n\n• Strengthen weak evidence for a specific element\n• Improve the reasoning to be more technically precise\n• Identify missing features or evidence gaps\n• Review the entire chart for overall assessment\n• Revert a previous change\n\nWhich element would you like to focus on?",
  };
}
