import { useState, useEffect, useCallback } from 'react';
import { notesService } from '../services/notesService';
import type { Note, CreateNoteInput, UpdateNoteInput } from '../types/database.types';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all notes with loading and error handling
  const fetchNotes = useCallback(async (searchQuery?: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await notesService.getNotes(searchQuery);
      if (error) throw error;
      setNotes(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new note
  const addNote = async (input: CreateNoteInput) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await notesService.createNote(input);
      if (error) throw error;
      if (data) {
        setNotes((prev) => [data, ...prev]);
      }
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to create note');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update note
  const updateNote = async (id: string, updates: UpdateNoteInput) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await notesService.updateNote(id, updates);
      if (error) throw error;
      if (data) {
        setNotes((prev) => prev.map((n) => (n.id === id ? data : n)));
      }
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to update note');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a note by ID
  const deleteNote = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await notesService.deleteNote(id);
      if (error) throw error;
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete note');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    loading,
    error,
    refetch: fetchNotes,
    addNote,
    updateNote,
    deleteNote,
  };
}
