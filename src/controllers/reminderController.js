const { StatusCodes } = require('http-status-codes')
const reminderService = require('../services/reminderService')
const noteService = require('../services/noteService')
const { successResponse } = require('../utils/responseHelper')
const createCustomError = require('../utils/customError')

const createReminder = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { noteId, reminderTime } = req.body

    const note = await noteService.getNoteById(noteId, userId)

    if (!note) {
      return next(createCustomError('Note not found', StatusCodes.NOT_FOUND))
    }

    const reminder = await reminderService.createReminder(
      noteId,
      userId,
      reminderTime
    )

    successResponse(
      res,
      StatusCodes.CREATED,
      'Reminder created successfully',
      reminder
    )
  } catch (error) {
    next(error)
  }
}

const getRemindersByUser = async (req, res, next) => {
  try {
    const userId = req.user.id
    const reminders = await reminderService.getRemindersByUser(userId)
    successResponse(
      res,
      StatusCodes.OK,
      'Reminders retrieved successfully',
      reminders
    )
  } catch (error) {
    next(error)
  }
}

const updateReminder = async (req, res, next) => {
  try {
    const { reminderId } = req.params
    const { reminderTime, status } = req.body

    const updatedReminder = await reminderService.updateReminder(reminderId, {
      reminderTime,
      status,
    })

    if (!updatedReminder) {
      return next(
        createCustomError('Reminder not found', StatusCodes.NOT_FOUND)
      )
    }

    successResponse(
      res,
      StatusCodes.OK,
      'Reminder updated successfully',
      updatedReminder
    )
  } catch (error) {
    next(error)
  }
}

const deleteReminder = async (req, res, next) => {
  try {
    const { reminderId } = req.params
    const deletedReminder = await reminderService.deleteReminder(reminderId)

    if (!deletedReminder) {
      return next(
        createCustomError('Reminder not found', StatusCodes.NOT_FOUND)
      )
    }

    successResponse(res, StatusCodes.OK, 'Reminder deleted successfully')
  } catch (error) {
    next(error)
  }
}

const ReminderController = {
  createReminder,
  getRemindersByUser,
  updateReminder,
  deleteReminder,
}

module.exports = ReminderController
