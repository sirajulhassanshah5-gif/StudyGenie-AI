export type QuestionType = 'mcq' | 'true_false' | 'short_question';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // For MCQ & True/False
  correctAnswerIndex?: number; // For MCQ (0-3) & True/False (0=True, 1=False)
  modelAnswer?: string; // For Short Questions
  keyKeywords?: string[]; // For Short Questions evaluation
  explanation: string;
  difficulty: QuestionDifficulty;
}

export interface QuizConfig {
  topic: string;
  difficulty: QuestionDifficulty;
  questionType: QuestionType | 'mixed';
  questionCount: number;
}

export interface UserAnswerRecord {
  questionId: string;
  selectedIndex?: number;
  shortAnswerText?: string;
  isCorrect?: boolean;
  scoreAwarded?: number; // 0 to 1
  feedback?: string;
}

export interface GeneratedQuiz {
  id: string;
  title: string;
  topic: string;
  difficulty: QuestionDifficulty;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface SampleQuizTopic {
  id: string;
  title: string;
  category: string;
  topicPrompt: string;
}
