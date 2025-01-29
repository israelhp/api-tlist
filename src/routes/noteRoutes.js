const express = require('express')
const noteController = require('../controllers/noteController')
const validateAccessToken = require('../middlewares/validateAccessTokenMiddleware')
const validateMiddleware = require('../middlewares/validateMiddleware')
const {
  createNoteSchema,
  updateNoteSchema,
  noteIdParamSchema,
  searchNoteSchema,
  deleteMultipleNotesSchema,
} = require('../utils/validations/noteValidation')

const router = express.Router()
/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Endpoints for managing notes
 */

/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the note
 *               content:
 *                 type: string
 *                 description: The content of the note
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags associated with the note
 *     responses:
 *       201:
 *         description: Note created successfully
 *       400:
 *         description: Invalid data
 */
router.post(
  '/',
  validateAccessToken,
  validateMiddleware(createNoteSchema),
  noteController.createNote
)

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Retrieve all notes of the authenticated user
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of notes retrieved successfully
 */
router.get('/', validateAccessToken, noteController.getAllNotes)

/**
 * @swagger
 * /notes/{noteId}:
 *   get:
 *     summary: Retrieve a note by its ID
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the note
 *     responses:
 *       200:
 *         description: Note retrieved successfully
 *       404:
 *         description: Note not found
 */
router.get(
  '/:noteId',
  validateAccessToken,
  validateMiddleware(noteIdParamSchema, 'params'),
  noteController.getNoteById
)

/**
 * @swagger
 * /notes/{noteId}:
 *   put:
 *     summary: Update an existing note
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the note
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Note updated successfully
 *       404:
 *         description: Note not found
 */
router.put(
  '/:noteId',
  validateAccessToken,
  validateMiddleware(noteIdParamSchema, 'params'),
  validateMiddleware(updateNoteSchema),
  noteController.updateNote
)

/**
 * @swagger
 * /notes/{noteId}:
 *   delete:
 *     summary: Delete a note by its ID
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the note to delete
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       404:
 *         description: Note not found
 */
router.delete(
  '/:noteId',
  validateAccessToken,
  validateMiddleware(noteIdParamSchema, 'params'),
  noteController.deleteNote
)

/**
 * @swagger
 * /notes/{noteId}/favorite:
 *   patch:
 *     summary: Mark a note as favorite
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the note to mark as favorite
 *     responses:
 *       200:
 *         description: Note marked as favorite successfully
 */
router.patch(
  '/:noteId/favorite',
  validateAccessToken,
  validateMiddleware(noteIdParamSchema, 'params'),
  noteController.markAsFavorite
)

/**
 * @swagger
 * /notes/search:
 *   get:
 *     summary: Search for notes by term
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search term
 *     responses:
 *       200:
 *         description: List of matching notes retrieved successfully
 */
router.get(
  '/search',
  validateAccessToken,
  validateMiddleware(searchNoteSchema, 'query'),
  noteController.searchNotes
)

/**
 * @swagger
 * /notes/tags:
 *   get:
 *     summary: Retrieve unique tags from notes
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of unique tags retrieved successfully
 */
router.get('/tags', validateAccessToken, noteController.getUniqueTags)

/**
 * @swagger
 * /notes:
 *   delete:
 *     summary: Delete multiple selected notes
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               noteIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Notes deleted successfully
 *       404:
 *         description: No notes found to delete
 */
router.delete(
  '/',
  validateAccessToken,
  validateMiddleware(deleteMultipleNotesSchema),
  noteController.deleteSelectedNotes
)

module.exports = router
