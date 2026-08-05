-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-------------------------------------------------------
-- 1. USERS TABLE (Extends auth.users)
-------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Trigger to create public.users profile automatically on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-------------------------------------------------------
-- 2. NOTES TABLE
-------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    tags TEXT[] DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);


-------------------------------------------------------
-- 3. FLASHCARDS TABLE
-------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    note_id UUID REFERENCES public.notes(id) ON DELETE SET NULL,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium' NOT NULL,
    last_reviewed TIMESTAMPTZ,
    next_review TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);


-------------------------------------------------------
-- 4. QUIZZES TABLE
-------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    note_id UUID REFERENCES public.notes(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    questions JSONB DEFAULT '[]'::jsonb NOT NULL,
    score INT DEFAULT 0 NOT NULL,
    total_questions INT DEFAULT 0 NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);


-------------------------------------------------------
-- 5. STUDY PLANS TABLE
-------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.study_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    schedule JSONB DEFAULT '[]'::jsonb NOT NULL,
    status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending' NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);


-------------------------------------------------------
-- 6. PROGRESS TABLE
-------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    study_time_minutes INT DEFAULT 0 NOT NULL,
    quizzes_completed INT DEFAULT 0 NOT NULL,
    flashcards_mastered INT DEFAULT 0 NOT NULL,
    streak_count INT DEFAULT 0 NOT NULL,
    last_active_date DATE DEFAULT CURRENT_DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);


-------------------------------------------------------
-- INDEXES FOR OPTIMIZED QUERYING
-------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON public.notes(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_flashcards_user_id ON public.flashcards(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_note_id ON public.flashcards(note_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_next_review ON public.flashcards(next_review);

CREATE INDEX IF NOT EXISTS idx_quizzes_user_id ON public.quizzes(user_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_note_id ON public.quizzes(note_id);

CREATE INDEX IF NOT EXISTS idx_study_plans_user_id ON public.study_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_study_plans_status ON public.study_plans(status);

CREATE INDEX IF NOT EXISTS idx_progress_user_id ON public.progress(user_id);


-------------------------------------------------------
-- AUTOMATED UPDATED_AT TRIGGER FUNCTION
-------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_flashcards_updated_at BEFORE UPDATE ON public.flashcards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON public.quizzes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_study_plans_updated_at BEFORE UPDATE ON public.study_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON public.progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

-- Users RLS
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Notes RLS
CREATE POLICY "Users can view own notes" ON public.notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notes" ON public.notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON public.notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON public.notes FOR DELETE USING (auth.uid() = user_id);

-- Flashcards RLS
CREATE POLICY "Users can view own flashcards" ON public.flashcards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own flashcards" ON public.flashcards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own flashcards" ON public.flashcards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own flashcards" ON public.flashcards FOR DELETE USING (auth.uid() = user_id);

-- Quizzes RLS
CREATE POLICY "Users can view own quizzes" ON public.quizzes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quizzes" ON public.quizzes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quizzes" ON public.quizzes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own quizzes" ON public.quizzes FOR DELETE USING (auth.uid() = user_id);

-- Study Plans RLS
CREATE POLICY "Users can view own study plans" ON public.study_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own study plans" ON public.study_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own study plans" ON public.study_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own study plans" ON public.study_plans FOR DELETE USING (auth.uid() = user_id);

-- Progress RLS
CREATE POLICY "Users can view own progress" ON public.progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own progress" ON public.progress FOR DELETE USING (auth.uid() = user_id);
