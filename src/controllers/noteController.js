const noteService = require('../services/noteService')
const { StatusCodes } = require('http-status-codes')
const {
  successResponse,
  createCustomError,
} = require('../utils/responseHelper')

const createNote = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body
    const userId = req.user.id

    if (!title || !content) {
      return next(
        createCustomError(
          'Title and content are required',
          StatusCodes.BAD_REQUEST
        )
      )
    }

    const note = await noteService.createNote(title, content, userId, tags)

    successResponse(res, StatusCodes.CREATED, 'Note created successfully', note)
  } catch (error) {
    next(error)
  }
}

const getAllNotes = async (req, res, next) => {
  try {
    const userId = req.user.id
    const notes = await noteService.getAllNotes(userId)

    successResponse(res, StatusCodes.OK, 'Notes retrieved successfully', notes)
  } catch (error) {
    next(error)
  }
}

const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params
    const userId = req.user.id

    const note = await noteService.getNoteById(noteId, userId)

    if (!note) {
      return next(createCustomError('Note not found', StatusCodes.NOT_FOUND))
    }

    successResponse(res, StatusCodes.OK, 'Note retrieved successfully', note)
  } catch (error) {
    next(error)
  }
}

const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params
    const { title, content, tags } = req.body
    const userId = req.user.id

    const note = await noteService.updateNote(
      noteId,
      title,
      content,
      userId,
      tags
    )

    if (!note) {
      return next(createCustomError('Note not found', StatusCodes.NOT_FOUND))
    }

    successResponse(res, StatusCodes.OK, 'Note updated successfully', note)
  } catch (error) {
    next(error)
  }
}

const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params
    const userId = req.user.id

    const note = await noteService.deleteNote(noteId, userId)

    if (!note) {
      return next(createCustomError('Note not found', StatusCodes.NOT_FOUND))
    }

    successResponse(res, StatusCodes.OK, 'Note deleted successfully', null)
  } catch (error) {
    next(error)
  }
}

const markAsFavorite = async (req, res, next) => {
  try {
    const { noteId } = req.params
    const userId = req.user.id

    const note = await noteService.markAsFavorite(noteId, userId)

    if (!note) {
      return next(createCustomError('Note not found', StatusCodes.NOT_FOUND))
    }

    successResponse(res, StatusCodes.OK, 'Note marked as favorite', note)
  } catch (error) {
    next(error)
  }
}

const unmarkAsFavorite = async (req, res, next) => {
  try {
    const { noteId } = req.params
    const userId = req.user.id

    const note = await noteService.unmarkAsFavorite(noteId, userId)

    if (!note) {
      return next(createCustomError('Note not found', StatusCodes.NOT_FOUND))
    }

    successResponse(res, StatusCodes.OK, 'Note unmarked as favorite', note)
  } catch (error) {
    next(error)
  }
}

const searchNotes = async (req, res, next) => {
  try {
    const { searchTerm } = req.query
    const userId = req.user.id

    const notes = await noteService.searchNotes(searchTerm, userId)

    successResponse(res, StatusCodes.OK, 'Notes found', notes)
  } catch (error) {
    next(error)
  }
}

const getUniqueTags = async (req, res, next) => {
  try {
    const userId = req.user.id

    const tags = await noteService.getUniqueTags(userId)

    successResponse(res, StatusCodes.OK, 'Unique tags retrieved', tags)
  } catch (error) {
    next(error)
  }
}

const deleteSelectedNotes = async (req, res, next) => {
  try {
    const { noteIds } = req.body
    const userId = req.user.id

    const result = await noteService.deleteSelectedNotes(noteIds, userId)

    if (result.deletedCount === 0) {
      return next(createCustomError('No notes deleted', StatusCodes.NOT_FOUND))
    }

    successResponse(res, StatusCodes.OK, 'Notes deleted successfully', null)
  } catch (error) {
    next(error)
  }
}

const NoteController = {
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

module.exports = NoteController
