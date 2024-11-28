import mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 900, // Document will be automatically deleted after 15 minutes (900 seconds)
  },
});

export default mongoose.models.OTP || mongoose.model('OTP', OTPSchema);
