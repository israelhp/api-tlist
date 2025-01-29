const Note = require('../models/Note')

const createNote = async (title, content, userId, tags = []) => {
  const note = new Note({
    title,
    content,
    user: userId,
    tags,
  })

  return await note.save()
}

const getAllNotes = async (userId) => {
  return await Note.find({ user: userId }).exec()
}

const getNoteById = async (noteId, userId) => {
  return await Note.findOne({ _id: noteId, user: userId }).exec()
}

const updateNote = async (noteId, title, content, userId, tags) => {
  return await Note.findOneAndUpdate(
    { _id: noteId, user: userId },
    { title, content, tags },
    { new: true }
  )
}

const deleteNote = async (noteId, userId) => {
  return await Note.findOneAndDelete({ _id: noteId, user: userId }).exec()
}

const markAsFavorite = async (noteId, userId) => {
  return await Note.findOneAndUpdate(
    { _id: noteId, user: userId },
    { $set: { isFavorite: true } },
    { new: true }
  )
}

const unmarkAsFavorite = async (noteId, userId) => {
  return await Note.findOneAndUpdate(
    { _id: noteId, user: userId },
    { $set: { isFavorite: false } },
    { new: true }
  )
}

const searchNotes = async (searchTerm, userId) => {
  return await Note.find({
    user: userId,
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } },
      { content: { $regex: searchTerm, $options: 'i' } },
    ],
  }).exec()
}

const getUniqueTags = async (userId) => {
  const notes = await Note.find({ user: userId }).exec()
  const tags = notes.reduce((acc, note) => {
    return [...acc, ...note.tags]
  }, [])
  return [...new Set(tags)]
}

const deleteSelectedNotes = async (noteIds, userId) => {
  return await Note.deleteMany({ _id: { $in: noteIds }, user: userId }).exec()
}

const NoteService = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  markAsFavorite,
  unmarkAsFavorite,
  searchNotes,
  getUniqueTags,
  deleteSelectedNotes,
}

module.exports = NoteService
