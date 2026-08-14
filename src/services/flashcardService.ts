import { getStoredApiKey } from './geminiService';
import type { FlashcardDeck, FlashcardItem, SampleFlashcardDeck } from '../types/flashcards';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODEL = 'gemini-1.5-flash';
const FLASHCARDS_STORAGE_KEY = 'studygenie_saved_flashcard_decks';

export const SAMPLE_FLASHCARD_DECKS: SampleFlashcardDeck[] = [
  {
    id: 'sample-ai',
    title: 'Machine Learning & Deep Learning',
    category: 'Computer Science',
    contentPrompt: `Key concepts in machine learning: Supervised vs Unsupervised learning, Overfitting and Regularization, Gradient Descent optimization, Convolutional Neural Networks (CNNs), Transformers and Attention Mechanisms.`
  },
  {
    id: 'sample-chem',
    title: 'Organic Chemistry & Mechanisms',
    category: 'Chemistry',
    contentPrompt: `Core concepts: Nucleophilic Substitution (SN1 vs SN2), Electrophilic Addition, Stereochemistry and Enantiomers, Functional groups, Resonance structures.`
  },
  {
    id: 'sample-bio',
    title: 'Cellular & Molecular Biology',
    category: 'Biology',
    contentPrompt: `Key topics: DNA Replication machinery, Transcription and RNA Polymerase, Translation and Ribosomes, Mitochondria and ATP synthesis, Cell Membrane transport.`
  }
];

export async function generateAIFlashcards(
  notesContent: string,
  cardCount: number = 8
): Promise<FlashcardDeck> {
  const apiKey = getStoredApiKey();

  if (apiKey) {
    try {
      return await fetchGeminiFlashcards(notesContent, cardCount, apiKey);
    } catch (error) {
      console.warn('Gemini API flashcards call failed, falling back to local extraction:', error);
    }
  }

  return generateLocalFlashcards(notesContent, cardCount);
}

async function fetchGeminiFlashcards(
  notes: string,
  count: number,
  apiKey: string
): Promise<FlashcardDeck> {
  const endpoint = `${GEMINI_API_BASE}/${DEFAULT_MODEL}:generateContent?key=${apiKey}`;

  const prompt = `You are StudyGenie AI, an expert study aid creator.
Extract exactly ${count} high-yield, concise study flashcards from the following notes/topic content.

NOTES CONTENT:
"""
${notes}
"""

Return ONLY a valid JSON object matching this structure (no markdown wrapper, no extra text):
{
  "title": "Clear descriptive title for this flashcard deck",
  "description": "Short 1-sentence deck overview",
  "cards": [
    {
      "id": "c1",
      "front": "Clear, concise Question or Key Term",
      "back": "Direct, informative Answer or Definition",
      "category": "Core Subject Tag"
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
        maxOutputTokens: 2560,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error ${response.status}`);
  }

  const data = await response.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  let cleanJson = textOutput.trim();
  if (cleanJson.startsWith('```json')) {
    cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleanJson.startsWith('```')) {
    cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  const parsed = JSON.parse(cleanJson);

  const cards: FlashcardItem[] = (parsed.cards || []).map((c: any, idx: number) => ({
    id: c.id || `c_${idx + 1}`,
    front: c.front || `Concept ${idx + 1}`,
    back: c.back || 'Definition / explanation',
    category: c.category || 'Study Material',
    isBookmarked: false,
    status: 'unseen'
  }));

  const deck: FlashcardDeck = {
    id: `deck_${Date.now()}`,
    title: parsed.title || extractDeckTitle(notes),
    description: parsed.description || `${cards.length} AI-generated revision cards`,
    cards,
    createdAt: new Date().toLocaleDateString()
  };

  saveDeckToHistory(deck);
  return deck;
}

function generateLocalFlashcards(notes: string, count: number): FlashcardDeck {
  const lines = notes.split('\n').map(l => l.trim()).filter(Boolean);
  const cards: FlashcardItem[] = [];

  lines.forEach((line, idx) => {
    if (cards.length >= count) return;

    if (line.includes(':')) {
      const parts = line.split(':');
      cards.push({
        id: `c_local_${idx}`,
        front: parts[0].replace(/^[-*0-9.]+\s*/, '').trim(),
        back: parts.slice(1).join(':').trim(),
        category: 'Notes Key Term',
        isBookmarked: false,
        status: 'unseen'
      });
    } else if (line.toLowerCase().includes('is defined as') || line.toLowerCase().includes('refers to')) {
      const parts = line.split(/is defined as|refers to/i);
      cards.push({
        id: `c_local_${idx}`,
        front: parts[0].replace(/^[-*0-9.]+\s*/, '').trim(),
        back: parts[1].trim(),
        category: 'Concept Definition',
        isBookmarked: false,
        status: 'unseen'
      });
    }
  });

  if (cards.length === 0) {
    cards.push(
      {
        id: 'c_def_1',
        front: 'What is the main topic of these study notes?',
        back: lines[0] || 'Core subject matter.',
        category: 'General',
        isBookmarked: false,
        status: 'unseen'
      },
      {
        id: 'c_def_2',
        front: 'What is the key takeaway?',
        back: lines[1] || 'Important concept details.',
        category: 'Takeaway',
        isBookmarked: false,
        status: 'unseen'
      }
    );
  }

  const deck: FlashcardDeck = {
    id: `deck_local_${Date.now()}`,
    title: extractDeckTitle(notes),
    description: `${cards.length} flashcards extracted from notes`,
    cards,
    createdAt: new Date().toLocaleDateString()
  };

  saveDeckToHistory(deck);
  return deck;
}

function extractDeckTitle(notes: string): string {
  const firstLine = notes.split('\n').map(l => l.trim()).filter(Boolean)[0] || 'Study Deck';
  const clean = firstLine.replace(/^#+\s*/, '').replace(/^[-*0-9.]+\s*/, '');
  return clean.length > 50 ? clean.slice(0, 47) + '...' : clean;
}

export function shuffleCards(cards: FlashcardItem[]): FlashcardItem[] {
  const array = [...cards];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function getSavedDecks(): FlashcardDeck[] {
  try {
    const raw = localStorage.getItem(FLASHCARDS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveDeckToHistory(deck: FlashcardDeck): void {
  try {
    const history = getSavedDecks();
    const updated = [deck, ...history.filter(d => d.id !== deck.id)].slice(0, 15);
    localStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save flashcard deck:', e);
  }
}
