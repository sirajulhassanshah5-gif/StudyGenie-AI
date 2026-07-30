// In-memory data store for notes
let notes = [
  { id: 1, title: 'Sample Note 1', content: 'This is the content of sample note 1.', createdAt: new Date().toISOString() },
  { id: 2, title: 'Sample Note 2', content: 'This is the content of sample note 2.', createdAt: new Date().toISOString() },
];

let nextId = 3;

export const NoteModel = {
  getAll: () => notes,
  
  getById: (id) => notes.find((note) => note.id === Number(id)),

  create: ({ title, content }) => {
    const newNote = {
      id: nextId++,
      title,
      content,
      createdAt: new Date().toISOString(),
    };
    notes.push(newNote);
    return newNote;
  },

  update: (id, { title, content }) => {
    const noteIndex = notes.findIndex((note) => note.id === Number(id));
    if (noteIndex === -1) return null;

    notes[noteIndex] = {
      ...notes[noteIndex],
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      updatedAt: new Date().toISOString(),
    };
    return notes[noteIndex];
  },

  delete: (id) => {
    const noteIndex = notes.findIndex((note) => note.id === Number(id));
    if (noteIndex === -1) return false;
    notes.splice(noteIndex, 1);
    return true;
  },

  deleteAll: () => {
    const count = notes.length;
    notes = [];
    return count;
  }
};
