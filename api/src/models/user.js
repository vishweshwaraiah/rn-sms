const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  profileImage: {
    type: String,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
