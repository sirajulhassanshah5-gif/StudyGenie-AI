export type FlashcardStatus = 'unseen' | 'learning' | 'mastered';

export interface FlashcardItem {
  id: string;
  front: string; // Question or Term
  back: string;  // Answer or Explanation
  category?: string;
  isBookmarked: boolean;
  status: FlashcardStatus;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  description: string;
  cards: FlashcardItem[];
  createdAt: string;
}

export interface SampleFlashcardDeck {
  id: string;
  title: string;
  category: string;
  contentPrompt: string;
}
