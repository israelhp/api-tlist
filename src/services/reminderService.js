const Reminder = require('../models/Reminder')

const createReminder = async (noteId, userId, reminderTime) => {
  const reminder = new Reminder({
    noteId,
    userId,
    reminderTime,
  })
  return await reminder.save()
}

const getRemindersByUser = async (userId) => {
  return await Reminder.find({ userId }).sort({ reminderTime: 1 })
}

const getRemindersById = async (reminderId) => {
  return await Reminder.findById(reminderId)
}

const updateReminder = async (reminderId, reminderTime, status) => {
  return await Reminder.findByIdAndUpdate(
    reminderId,
    { reminderTime, status },
    { new: true }
  )
}

const deleteReminder = async (reminderId) => {
  return await Reminder.findByIdAndDelete(reminderId)
}

const ReminderService = {
  createReminder,
  getRemindersByUser,
  getRemindersById,
  updateReminder,
  deleteReminder,
}

module.exports = ReminderService
