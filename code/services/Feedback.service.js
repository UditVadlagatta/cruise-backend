import feedbackModel from '../models/feedback.model.js';

class FeedbackService {

  async createFeedback(customerId, username, data) {
    // const existingFeedback = await feedbackModel.findOne({
    //   customer: customerId,
    //   subject: data.subject,
    //   subOption: data.subOption || null,
    //   status: 'pending',
    // });

    // if (existingFeedback) {
    //   throw new Error('You already have a pending feedback for this issue.');
    // }

    const feedback = await feedbackModel.create({
      customer: customerId,
      username,
      subject: data.subject,
      subOption: data.subOption || null,
      otherSubject: data.subject === 'other' ? data.otherSubject : null,
      message: data.message,
    });

    return feedback;
  }

//   async replyToFeedback(id, reply, workerUsername) {
//     if (!reply || !reply.trim()) {
//       throw new Error('Reply message is required.');
//     }
 
//     const feedback = await feedbackModel.findByIdAndUpdate(
//       id,
//       {
//         reply: reply.trim(),
//         repliedAt: new Date(),
//         repliedBy: workerUsername,
//         // auto move to in_review if still pending
//         ...(await feedbackModel.findById(id).then(f => f?.status === 'pending' ? { status: 'in_review' } : {}))
//       },
//       { new: true, runValidators: true }
//     );
 
//     if (!feedback) throw new Error('Feedback not found');
//     return feedback;
//   }

async replyToFeedback(id, reply, workerUsername) {
  if (!reply || !reply.trim()) {
    throw new Error('Reply message is required.');
  }

  // ✅ fetch first, then update in one flow
  const existing = await feedbackModel.findById(id);
  if (!existing) throw new Error('Feedback not found');

  existing.reply     = reply.trim();
  existing.repliedAt = new Date();
  existing.repliedBy = workerUsername;

  // auto move to in_review if still pending
  if (existing.status === 'pending') {
    existing.status = 'in_review';
  }

  await existing.save();
  return existing;
}

  async getAllFeedbacks({ page = 1, limit = 10, status } = {}) {
    const filter = status ? { status } : {};
    const skip = (page - 1) * limit;

    const feedbacks = await feedbackModel
      .find(filter)
      .populate('customer', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await feedbackModel.countDocuments(filter);

    return {
      feedbacks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getMyFeedbacks(customerId) {
    const feedbacks = await feedbackModel
      .find({ customer: customerId })
      .sort({ createdAt: -1 });

    return feedbacks;
  }

  async getFeedbackById(id) {
    const feedback = await feedbackModel
      .findById(id)
      .populate('customer', 'username email');

    if (!feedback) {
      throw new Error('Feedback not found');
    }

    return feedback;
  }

  async updateFeedbackStatus(id, status) {
    const feedback = await feedbackModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      throw new Error('Feedback not found');
    }

    return feedback;
  }

  async deleteFeedback(id) {
    const feedback = await feedbackModel.findByIdAndDelete(id);

    if (!feedback) {
      throw new Error('Feedback not found');
    }

    return feedback;
  }
}

export default new FeedbackService();