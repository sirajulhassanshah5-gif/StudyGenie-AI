import { supabase } from '../lib/supabaseClient';
import type { Note, CreateNoteInput, UpdateNoteInput } from '../types/database.types';

export const notesService = {
  // 1. Fetch all notes with optional search query
  getNotes: async (searchQuery?: string): Promise<{ data: Note[] | null; error: any }> => {
    let query = supabase.from('notes').select('*').order('created_at', { ascending: false });

    if (searchQuery && searchQuery.trim() !== '') {
      query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
    }

    const { data, error } = await query;
    return { data: data as Note[] | null, error };
  },

  // 2. Fetch single note by ID
  getNoteById: async (id: string): Promise<{ data: Note | null; error: any }> => {
    const { data, error } = await supabase.from('notes').select('*').eq('id', id).single();
    return { data: data as Note | null, error };
  },

  // 3. Create new note
  createNote: async (input: CreateNoteInput): Promise<{ data: Note | null; error: any }> => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('notes')
      .insert([
        {
          user_id: user.id,
          title: input.title,
          content: input.content,
          summary: input.summary || null,
          tags: input.tags || [],
          is_favorite: input.is_favorite || false,
        },
      ])
      .select()
      .single();

    return { data: data as Note | null, error };
  },

  // 4. Update note
  updateNote: async (id: string, updates: UpdateNoteInput): Promise<{ data: Note | null; error: any }> => {
    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data: data as Note | null, error };
  },

  // 5. Delete note
  deleteNote: async (id: string): Promise<{ error: any }> => {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    return { error };
  },

  // 6. Toggle favorite status
  toggleFavorite: async (id: string, is_favorite: boolean): Promise<{ data: Note | null; error: any }> => {
    const { data, error } = await supabase
      .from('notes')
      .update({ is_favorite })
      .eq('id', id)
      .select()
      .single();

    return { data: data as Note | null, error };
  },
};
