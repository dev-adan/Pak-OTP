import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  sessionToken: {
    type: String,
    unique: true,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  expires: {
    type: Date,
    required: true,
  },
  // Custom fields for enhanced session tracking
  lastActivity: {
    type: Date,
    default: Date.now,
  },
  deviceInfo: {
    userAgent: String,
    browser: String,
    os: String,
    device: String,
    ip: String
  },
  isValid: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for faster queries and automatic expiration
sessionSchema.index({ sessionToken: 1 }, { unique: true });
sessionSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);

export default Session;
