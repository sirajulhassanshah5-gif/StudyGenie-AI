export interface KeyPoint {
  id: string;
  title: string;
  description: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface ImportantDefinition {
  id: string;
  term: string;
  definition: string;
  context?: string;
}

export interface ActionItem {
  id: string;
  task: string;
  completed: boolean;
  dueDate?: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface AISummaryResult {
  id: string;
  title: string;
  shortSummary: string;
  detailedSummary: string;
  keyPoints: KeyPoint[];
  importantDefinitions: ImportantDefinition[];
  actionItems: ActionItem[];
  metadata: {
    originalLength: number;
    wordCount: number;
    readingTimeMinutes: number;
    createdAt: string;
  };
}

export interface SummaryOptions {
  length: 'concise' | 'standard' | 'comprehensive';
  tone: 'academic' | 'simplified' | 'executive' | 'exam-focused';
  customFocus?: string;
}

export interface SampleNote {
  id: string;
  title: string;
  category: string;
  content: string;
}
