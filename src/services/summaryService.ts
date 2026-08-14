import { getStoredApiKey } from './geminiService';
import type { AISummaryResult, SummaryOptions, SampleNote } from '../types/summary';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODEL = 'gemini-1.5-flash';
const SUMMARY_STORAGE_KEY = 'studygenie_ai_summaries_history';

export const SAMPLE_NOTES: SampleNote[] = [
  {
    id: 'sample-1',
    title: 'Artificial Intelligence & Machine Learning Fundamentals',
    category: 'Computer Science',
    content: `Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think like humans and mimic their actions. Machine Learning (ML) is a subfield of AI focused on building systems that learn—or improve performance—based on the data they consume.

Key Components of Machine Learning:
1. Supervised Learning: Algorithms are trained using labeled datasets where the input and correct output are provided (e.g., linear regression, classification decision trees).
2. Unsupervised Learning: Algorithms discover hidden patterns, intrinsic structures, or groupings in unlabeled data (e.g., K-Means clustering, PCA).
3. Reinforcement Learning: Agents take actions in an environment to maximize cumulative reward through trial and error (e.g., Q-Learning, Deep Q Networks).

Deep Learning & Neural Networks:
Deep Learning is a specialized subset of ML based on Artificial Neural Networks (ANNs) with multiple hidden layers. Perceptrons serve as basic building blocks. Backpropagation computes the gradient of the loss function with respect to weights using the chain rule, enabling stochastic gradient descent (SGD) to optimize performance.

Important Definitions:
- Overfitting: A modeling error where the model learns noise and details in training data to the extent that it negatively impacts performance on new data.
- Epoch: One complete pass through the entire training dataset.
- Hyperparameters: Parameters whose values are set before the learning process begins (e.g., learning rate, batch size).

Actionable Next Steps:
- Implement a basic Linear Regression model in Python using scikit-learn.
- Review cross-entropy loss formula and derivatives.
- Practice hyperparameter tuning using grid search and random search.`
  },
  {
    id: 'sample-2',
    title: 'Cellular Respiration & ATP Production',
    category: 'Biology',
    content: `Cellular respiration is a set of metabolic reactions and processes that take place in the cells of organisms to convert biochemical energy from nutrients into adenosine triphosphate (ATP), and then release waste products.

Three Main Stages:
1. Glycolysis: Occurs in the cytoplasm. Glucose (6-carbon sugar) is broken down into two molecules of pyruvate (3-carbon), producing a net yield of 2 ATP and 2 NADH molecules. This phase is anaerobic (does not require oxygen).
2. The Krebs Cycle (Citric Acid Cycle): Occurs in the mitochondrial matrix. Acetyl-CoA combines with oxaloacetate to produce citrate. Through a series of redox reactions, it generates 2 ATP, 6 NADH, and 2 FADH2 per glucose molecule, releasing CO2 as a byproduct.
3. Oxidative Phosphorylation & Electron Transport Chain (ETC): Occurs across the inner mitochondrial membrane. High-energy electrons from NADH and FADH2 are transferred along protein complexes (I-IV). This creates a proton gradient across the membrane (chemiosmosis), powering ATP synthase to produce approximately 26 to 28 ATP molecules.

Key Definitions:
- Adenosine Triphosphate (ATP): The primary energy currency of the cell storing energy in high-energy phosphate bonds.
- Anaerobic Respiration: Respiration occurring in the absence of oxygen, leading to fermentation (lactic acid or ethanol).
- Chemiosmosis: The movement of ions across a semipermeable membrane bound structure, down their electrochemical gradient.

Action Items:
- Diagram the electron transport chain and locate complexes I through IV.
- Calculate total ATP output comparing aerobic vs anaerobic respiration.
- Flashcard study: Net yields of Glycolysis vs Krebs Cycle.`
  },
  {
    id: 'sample-3',
    title: 'Macroeconomics: Monetary & Fiscal Policy',
    category: 'Economics',
    content: `Economic stability and growth are primarily managed through two main policy instruments: Monetary Policy and Fiscal Policy.

Monetary Policy:
Managed by a country's Central Bank (e.g., Federal Reserve). Tools include interest rates (Federal Funds Rate), open market operations (buying/selling government bonds), and reserve requirements.
- Expansionary Monetary Policy: Lowering interest rates and purchasing bonds to increase money supply, stimulate borrowing, and boost aggregate demand during recessions.
- Contractionary Monetary Policy: Raising interest rates to cool down an overheating economy and curb inflation.

Fiscal Policy:
Managed by the government (legislature and executive branches). Tools include taxation and government spending.
- Expansionary Fiscal Policy: Increasing government spending or cutting taxes to stimulate economic activity.
- Contractionary Fiscal Policy: Reducing spending or raising taxes to reduce budget deficits and slow inflationary pressures.

Key Concepts & Definitions:
- Inflation: The rate at which the general level of prices for goods and services is rising, eroding purchasing power.
- Liquidity Trap: A situation where interest rates are near zero and saving rates are high, rendering monetary policy ineffective.
- Multiplier Effect: The proportional amount of increase, or decrease, in final income that results from an injection or withdrawal of capital.

Next Steps for Study:
- Solve aggregate supply and aggregate demand (AS-AD) shift exercises.
- Read case study on the 2008 Federal Reserve Quantitative Easing strategy.
- Prepare key formulas for Marginal Propensity to Consume (MPC) and Tax Multiplier.`
  }
];

export async function generateAISummary(
  notesContent: string,
  options: SummaryOptions = { length: 'standard', tone: 'academic' }
): Promise<AISummaryResult> {
  const apiKey = getStoredApiKey();
  const title = extractTitleFromContent(notesContent);

  if (apiKey) {
    try {
      const result = await fetchGeminiSummary(notesContent, options, apiKey);
      saveSummaryToHistory(result);
      return result;
    } catch (error) {
      console.warn('Gemini API call failed, falling back to local intelligent summary extraction:', error);
    }
  }

  // Local Intelligent Summary Generator fallback
  const fallbackResult = generateLocalIntelligentSummary(notesContent, title, options);
  saveSummaryToHistory(fallbackResult);
  return fallbackResult;
}

async function fetchGeminiSummary(
  content: string,
  options: SummaryOptions,
  apiKey: string
): Promise<AISummaryResult> {
  const endpoint = `${GEMINI_API_BASE}/${DEFAULT_MODEL}:generateContent?key=${apiKey}`;

  const prompt = `You are StudyGenie AI, an elite academic assistant.
Analyze the following user notes and produce a comprehensive, beautifully structured JSON response.

Options:
- Summary Length: ${options.length}
- Tone / Format: ${options.tone}
${options.customFocus ? `- Specific Focus: ${options.customFocus}` : ''}

USER NOTES CONTENT:
"""
${content}
"""

Return ONLY a valid JSON object matching this structure (no markdown backticks around json, no preamble):
{
  "title": "Clear descriptive title derived from the notes",
  "shortSummary": "A concise 2-3 sentence executive TL;DR summary highlighting the main core takeaway.",
  "detailedSummary": "A multi-paragraph, detailed, structured summary explaining concepts thoroughly with bullet points and clear sections.",
  "keyPoints": [
    {
      "id": "kp-1",
      "title": "Short title of key point",
      "description": "Elaboration on why this point matters.",
      "priority": "high" // or "medium" or "low"
    }
  ],
  "importantDefinitions": [
    {
      "id": "def-1",
      "term": "Term Name",
      "definition": "Clear concise definition.",
      "context": "Optional context or example."
    }
  ],
  "actionItems": [
    {
      "id": "act-1",
      "task": "Action item, practice step, or question to review",
      "completed": false,
      "priority": "high" // or "medium" or "low"
    }
  ]
}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 3072,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`API response failed with status ${response.status}`);
  }

  const data = await response.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  
  // Clean markdown json formatting if present
  let cleanJson = textOutput.trim();
  if (cleanJson.startsWith('```json')) {
    cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleanJson.startsWith('```')) {
    cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  const parsed = JSON.parse(cleanJson);
  
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  
  return {
    id: `sum_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    title: parsed.title || extractTitleFromContent(content),
    shortSummary: parsed.shortSummary || 'Summary generated successfully.',
    detailedSummary: parsed.detailedSummary || content,
    keyPoints: (parsed.keyPoints || []).map((kp: any, idx: number) => ({
      id: kp.id || `kp_${idx}`,
      title: kp.title || `Key Point ${idx + 1}`,
      description: kp.description || '',
      priority: kp.priority || 'medium'
    })),
    importantDefinitions: (parsed.importantDefinitions || []).map((def: any, idx: number) => ({
      id: def.id || `def_${idx}`,
      term: def.term || 'Term',
      definition: def.definition || '',
      context: def.context || ''
    })),
    actionItems: (parsed.actionItems || []).map((act: any, idx: number) => ({
      id: act.id || `act_${idx}`,
      task: act.task || 'Review notes',
      completed: false,
      priority: act.priority || 'medium'
    })),
    metadata: {
      originalLength: content.length,
      wordCount: wordCount,
      readingTimeMinutes: Math.max(1, Math.ceil(wordCount / 200)),
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
  };
}

function generateLocalIntelligentSummary(
  content: string,
  title: string,
  options: SummaryOptions
): AISummaryResult {
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
  const words = content.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const maxPoints = options.length === 'concise' ? 3 : options.length === 'comprehensive' ? 8 : 5;

  // Extract key points
  const keyPointsList = lines
    .filter(l => l.startsWith('-') || l.startsWith('*') || l.startsWith('1.') || l.startsWith('2.') || l.startsWith('3.') || l.includes(':'))
    .slice(0, maxPoints)
    .map((line, idx) => {
      const clean = line.replace(/^[-*0-9.]+\s*/, '');
      const parts = clean.split(':');
      return {
        id: `kp_${idx}`,
        title: parts[0]?.trim() || `Core Concept ${idx + 1}`,
        description: parts[1]?.trim() || clean,
        priority: (idx === 0 ? 'high' : idx === 1 ? 'high' : 'medium') as 'high' | 'medium' | 'low'
      };
    });

  if (keyPointsList.length === 0) {
    keyPointsList.push(
      { id: 'kp_1', title: 'Main Theme Analysis', description: lines[0] || 'Core topic overview from notes.', priority: 'high' },
      { id: 'kp_2', title: 'Secondary Insights', description: lines[1] || 'Key background and structural context.', priority: 'medium' }
    );
  }

  // Extract definitions (lines with ":" or "is defined as")
  const defsList = lines
    .filter(l => l.toLowerCase().includes(':') || l.toLowerCase().includes('refers to') || l.toLowerCase().includes('is defined as'))
    .slice(0, 4)
    .map((line, idx) => {
      let term = 'Concept';
      let def = line;
      if (line.includes(':')) {
        const parts = line.split(':');
        term = parts[0].replace(/^[-*0-9.]+\s*/, '').trim();
        def = parts.slice(1).join(':').trim();
      } else if (line.toLowerCase().includes('refers to')) {
        const parts = line.split(/refers to/i);
        term = parts[0].replace(/^[-*0-9.]+\s*/, '').trim();
        def = 'Refers to ' + parts[1].trim();
      }
      return {
        id: `def_${idx}`,
        term: term,
        definition: def,
        context: `Key terminology from study material`
      };
    });

  if (defsList.length === 0) {
    defsList.push({
      id: 'def_0',
      term: title,
      definition: 'Primary subject matter covered in these notes.',
      context: 'Core Study Topic'
    });
  }

  // Extract action items
  const actionItemsList = lines
    .filter(l => l.toLowerCase().includes('action') || l.toLowerCase().includes('next step') || l.toLowerCase().includes('practice') || l.toLowerCase().includes('review') || l.toLowerCase().includes('study'))
    .slice(0, 4)
    .map((line, idx) => ({
      id: `act_${idx}`,
      task: line.replace(/^[-*0-9.]+\s*/, '').replace(/^(Action Items|Next Steps|Practice):/i, '').trim(),
      completed: false,
      priority: (idx === 0 ? 'high' : 'medium') as 'high' | 'medium'
    }));

  if (actionItemsList.length === 0) {
    actionItemsList.push(
      { id: 'act_1', task: `Review key concepts in ${title}`, completed: false, priority: 'high' },
      { id: 'act_2', task: 'Create flashcards for important definitions', completed: false, priority: 'high' },
      { id: 'act_3', task: 'Take a self-quiz on core takeaways', completed: false, priority: 'medium' }
    );
  }

  const firstFew = lines.slice(0, 3).join(' ');
  const shortSummary = `${firstFew.length > 220 ? firstFew.slice(0, 220) + '...' : firstFew} (Summary generated using intelligent extraction engine).`;
  
  const detailedSummary = lines.length > 0 
    ? lines.map((l, i) => i === 0 ? `### ${l}\n` : l.startsWith('#') ? l : `• ${l}`).join('\n\n')
    : content;

  return {
    id: `sum_${Date.now()}_local`,
    title: title,
    shortSummary,
    detailedSummary,
    keyPoints: keyPointsList,
    importantDefinitions: defsList,
    actionItems: actionItemsList,
    metadata: {
      originalLength: content.length,
      wordCount: wordCount,
      readingTimeMinutes: Math.max(1, Math.ceil(wordCount / 200)),
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
  };
}

function extractTitleFromContent(content: string): string {
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length > 0) {
    const firstLine = lines[0].replace(/^#+\s*/, '').replace(/^[-*0-9.]+\s*/, '');
    if (firstLine.length < 70) return firstLine;
    return firstLine.slice(0, 65) + '...';
  }
  return 'Study Notes Summary';
}

export function getSummaryHistory(): AISummaryResult[] {
  try {
    const raw = localStorage.getItem(SUMMARY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSummaryToHistory(summary: AISummaryResult): void {
  try {
    const history = getSummaryHistory();
    const updated = [summary, ...history.filter(s => s.id !== summary.id)].slice(0, 20);
    localStorage.setItem(SUMMARY_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save summary history:', e);
  }
}

export function deleteSummaryFromHistory(id: string): AISummaryResult[] {
  try {
    const history = getSummaryHistory();
    const updated = history.filter(s => s.id !== id);
    localStorage.setItem(SUMMARY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string) || '');
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
}
