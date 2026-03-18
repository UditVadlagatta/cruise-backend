import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      enum: ['cruise_booking', 'payment', 'other'],
      required: true,
    },
    subOption: {
      type: String,
      trim: true,
      default: null,
    },
    otherSubject: {
      type: String,
      trim: true,
      default: null,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ['pending', 'in_review', 'resolved'],
      default: 'pending',
    },
    // ✅ reply from worker
    reply: {
      type: String,
      trim: true,
      default: null,
    },
    repliedAt: {
      type: Date,
      default: null,
    },
    repliedBy: {
      type: String,  // worker username
      default: null,
    },
  },
  { timestamps: true }
);

const feedbackModel = mongoose.model('Feedback', feedbackSchema);

export default feedbackModel;