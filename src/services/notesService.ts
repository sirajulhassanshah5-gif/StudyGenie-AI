import apiClient from './apiClient';

export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
}

export const notesService = {
  // GET /notes - Fetch all notes or single note by ID
  getNotes: async (id?: number): Promise<ApiResponse<Note[] | Note>> => {
    const url = id ? `/notes?id=${id}` : '/notes';
    return apiClient.get(url);
  },

  // POST /notes - Create a new note
  createNote: async (noteData: { title: string; content: string }): Promise<ApiResponse<Note>> => {
    return apiClient.post('/notes', noteData);
  },

  // PUT /notes - Update existing note
  updateNote: async (id: number, noteData: { title?: string; content?: string }): Promise<ApiResponse<Note>> => {
    return apiClient.put('/notes', { id, ...noteData });
  },

  // DELETE /notes - Delete a note by ID
  deleteNote: async (id?: number): Promise<ApiResponse<null>> => {
    const url = id ? `/notes?id=${id}` : '/notes';
    return apiClient.delete(url);
  },
};
