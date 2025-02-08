const Joi = require('joi')

const createReminderSchema = Joi.object({
  noteId: Joi.string().hex().length(24).required(),
  reminderTime: Joi.date().greater('now').required(), // Debe ser una fecha futura
})

const reminderIdParamSchema = Joi.object({
  reminderId: Joi.string().hex().length(24).required(),
})

const updateReminderSchema = Joi.object({
  reminderTime: Joi.date().greater('now').required(),
  status: Joi.string().valid('pending', 'sent', 'failed').optional(),
})

module.exports = {
  createReminderSchema,
  reminderIdParamSchema,
  updateReminderSchema,
}
