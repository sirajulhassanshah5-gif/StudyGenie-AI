import express from 'express';
import { getNotes, createNote, updateNote, deleteNote } from '../controllers/noteController.js';

const router = express.Router();

// REST API routes for /notes
router.get('/notes', getNotes);
router.post('/notes', createNote);
router.put('/notes', updateNote);
router.delete('/notes', deleteNote);

export default router;
