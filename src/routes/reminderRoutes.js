const express = require('express')
const reminderController = require('../controllers/reminderController')
const validateAccessToken = require('../middlewares/validateAccessTokenMiddleware')
const validateMiddleware = require('../middlewares/validateMiddleware')
const {
  reminderIdParamSchema,
  updateReminderSchema,
  createReminderSchema,
} = require('../utils/validations/reminderValidation')

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Reminders
 *   description: Reminder management
 */

/**
 * @swagger
 * /reminders:
 *   post:
 *     summary: Create a new reminder
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - noteId
 *               - reminderTime
 *             properties:
 *               noteId:
 *                 type: string
 *                 example: "65cfb9a3b2d1c30012a12345"
 *               reminderTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-03-10T14:00:00Z"
 *     responses:
 *       201:
 *         description: Reminder successfully created
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Note not found
 */
router.post(
  '/',
  validateAccessToken,
  validateMiddleware(createReminderSchema),
  reminderController.createReminder
)

/**
 * @swagger
 * /reminders:
 *   get:
 *     summary: Get all reminders for the authenticated user
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved reminders
 *       401:
 *         description: Unauthorized
 */
router.get('/', validateAccessToken, reminderController.getRemindersByUser)

/**
 * @swagger
 * /reminders/{reminderId}:
 *   patch:
 *     summary: Update a reminder
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: reminderId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "65cfd2b5a3b1d20012a34567"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reminderTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-03-15T09:30:00Z"
 *               status:
 *                 type: string
 *                 enum: ["pending", "sent", "failed"]
 *                 example: "sent"
 *     responses:
 *       200:
 *         description: Reminder successfully updated
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Reminder not found
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/:reminderId',
  validateAccessToken,
  validateMiddleware(reminderIdParamSchema, 'params'),
  validateMiddleware(updateReminderSchema),
  reminderController.updateReminder
)

/**
 * @swagger
 * /reminders/{reminderId}:
 *   delete:
 *     summary: Delete a reminder
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: reminderId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "65cfd2b5a3b1d20012a34567"
 *     responses:
 *       200:
 *         description: Reminder successfully deleted
 *       404:
 *         description: Reminder not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
  '/:reminderId',
  validateAccessToken,
  validateMiddleware(reminderIdParamSchema, 'params')
)

module.exports = router
