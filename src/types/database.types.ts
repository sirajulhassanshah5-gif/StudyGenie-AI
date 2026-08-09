export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  summary?: string | null;
  tags?: string[];
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  summary?: string;
  tags?: string[];
  is_favorite?: boolean;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  summary?: string;
  tags?: string[];
  is_favorite?: boolean;
}

export interface Flashcard {
  id: string;
  user_id: string;
  note_id?: string | null;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  last_reviewed?: string | null;
  next_review?: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  user_id: string;
  note_id?: string | null;
  title: string;
  questions: QuizQuestion[];
  score: number;
  total_questions: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudyPlan {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  schedule: Json[];
  status: 'pending' | 'in_progress' | 'completed';
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface Progress {
  id: string;
  user_id: string;
  study_time_minutes: number;
  quizzes_completed: number;
  flashcards_mastered: number;
  streak_count: number;
  last_active_date: string;
  created_at: string;
  updated_at: string;
}

export interface PdfDocument {
  id: string;
  user_id: string;
  name: string;
  file_path: string;
  public_url: string;
  size_bytes: number;
  mime_type: string;
  created_at: string;
  updated_at: string;
}

export interface UploadPdfInput {
  file: File;
}

