import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  deviceInfo: {
    browser: String,
    os: String,
    device: String
  },
  ipAddress: String,
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  tokenTimestamp: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Index for faster token validation queries
sessionSchema.index({ userId: 1, isActive: 1, tokenTimestamp: 1 });

const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);

export { Session };
export default Session;
