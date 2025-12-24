const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true , 'Email is required'],
    unique: [true , "This email is already registered"],
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: [true , 'Password is required'],
    match: [/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/, 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit']
  },
  phoneNumber: {
    type: String,
    match: [/^01[0125]\d{8}$/, 'Please fill a valid phone number']
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;