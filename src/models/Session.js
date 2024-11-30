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
  }
});

const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);

export default Session;
