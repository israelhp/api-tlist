const Joi = require('joi')

const createNoteSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  content: Joi.string().min(5).required(),
  tags: Joi.array().items(Joi.string()).optional(),
})

const updateNoteSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  content: Joi.string().min(5).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
})

const noteIdParamSchema = Joi.object({
  noteId: Joi.string().hex().length(24).required(),
})

const searchNoteSchema = Joi.object({
  searchTerm: Joi.string().min(1).optional(),
})

const deleteMultipleNotesSchema = Joi.object({
  noteIds: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
})

module.exports = {
  createNoteSchema,
  updateNoteSchema,
  noteIdParamSchema,
  searchNoteSchema,
  deleteMultipleNotesSchema,
}
