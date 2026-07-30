import { NoteModel } from '../models/NoteModel.js';

// GET /notes - Retrieve all notes or a specific note by ID query parameter (?id=1)
export const getNotes = (req, res) => {
  try {
    const { id } = req.query;
    if (id) {
      const note = NoteModel.getById(id);
      if (!note) {
        return res.status(404).json({ success: false, message: 'Note not found' });
      }
      return res.status(200).json({ success: true, data: note });
    }
    const notes = NoteModel.getAll();
    return res.status(200).json({ success: true, count: notes.length, data: notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /notes - Create a new note
export const createNote = (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required fields' });
    }
    const newNote = NoteModel.create({ title, content });
    return res.status(201).json({ success: true, message: 'Note created successfully', data: newNote });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /notes - Update an existing note (expects id in body or query)
export const updateNote = (req, res) => {
  try {
    const id = req.query.id || req.body.id;
    const { title, content } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Note ID is required for update' });
    }

    const updatedNote = NoteModel.update(id, { title, content });
    if (!updatedNote) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    return res.status(200).json({ success: true, message: 'Note updated successfully', data: updatedNote });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /notes - Delete a note by ID (or all notes if no ID provided)
export const deleteNote = (req, res) => {
  try {
    const id = req.query.id || req.body.id;

    if (!id) {
      const deletedCount = NoteModel.deleteAll();
      return res.status(200).json({ success: true, message: `All notes deleted (${deletedCount} items)` });
    }

    const deleted = NoteModel.delete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    return res.status(200).json({ success: true, message: `Note with ID ${id} deleted successfully` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
