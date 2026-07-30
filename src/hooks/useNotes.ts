import { useState, useEffect, useCallback } from 'react';
import { notesService, type Note } from '../services/notesService';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all notes with loading and error handling
  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await notesService.getNotes();
      setNotes(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (err: any) {
      setError(err.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new note
  const addNote = async (title: string, content: string) => {
    setLoading(true);
    setError(null);
    try {
      await notesService.createNote({ title, content });
      await fetchNotes(); // Refresh list
    } catch (err: any) {
      setError(err.message || 'Failed to create note');
      setLoading(false);
    }
  };

  // Delete a note by ID
  const deleteNote = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await notesService.deleteNote(id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete note');
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
    deleteNote,
  };
}
