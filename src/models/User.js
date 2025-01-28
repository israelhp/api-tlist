const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    photo: { type: String },
    providers: {
      type: [String],
      default: [],
      enum: ['google', 'github'],
    },
    refreshToken: { type: String },
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
