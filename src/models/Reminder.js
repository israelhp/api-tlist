// models/reminder.js
const mongoose = require('mongoose')

const reminderSchema = new mongoose.Schema({
  noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reminderTime: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending',
  },
})

module.exports = mongoose.model('Reminder', reminderSchema)
