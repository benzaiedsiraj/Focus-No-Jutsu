const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    unique: true,
    sparse: true, // Allows null/missing emails to not conflict unique indexes
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    // Removed specific required:true allowing OAuth to register securely natively
    minlength: 6 
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('User', userSchema);
