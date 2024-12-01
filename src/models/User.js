import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  hashedPassword: {
    type: String,
    required: function() {
      return !this.googleId; // Password only required if not using Google
    }
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  image: String,
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date,
  tokenVersion: {
    type: Number,
    default: 0
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
