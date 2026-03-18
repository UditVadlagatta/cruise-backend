import mongoose from "mongoose";
import feedbackService from "../services/Feedback.service.js" // ✅ fixed import name
import customerModel from "../models/customer.model.js";

class FeedbackController {

  // POST /api/feedbacks/create
  async create(req, res) {
    try {
      const { subject, subOption, otherSubject, message } = req.body;

      // ✅ token stores customer_id not _id
      const customerId = req.customer?.customer_id;

      // ✅ check customerId BEFORE DB query
      if (!customerId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
      }

      // ✅ username not in token, fetch from DB
      const customerData = await customerModel.findById(customerId).select('username');
      if (!customerData) {
        return res.status(404).json({ message: 'Customer not found.' });
      }
      const username = customerData.username;

      if (!subject || !message) {
        return res.status(400).json({ message: 'subject and message are required.' });
      }

      if ((subject === 'cruise_booking' || subject === 'payment') && !subOption) {
        return res.status(400).json({ message: 'Please select an issue type.' });
      }

      if (subject === 'other' && !otherSubject?.trim()) {
        return res.status(400).json({ message: 'Please describe your subject.' });
      }

      if (message.trim().length < 20) {
        return res.status(400).json({ message: 'Message must be at least 20 characters.' });
      }

      const feedback = await feedbackService.createFeedback(customerId, username, {
        subject,
        subOption,
        otherSubject,
        message,
      });

      return res.status(201).json({
        message: 'Feedback submitted successfully!',
        feedback,
      });
    } catch (err) {
      const statusCode = err.message.includes('already have a pending') ? 400 : 500;
      return res.status(statusCode).json({ message: err.message });
    }
  }

  // GET /api/feedbacks/getall (admin)
  async getAll(req, res) {
    try {
      const { page, limit, status } = req.query;

      const result = await feedbackService.getAllFeedbacks({
        page:  parseInt(page)  || 1,
        limit: parseInt(limit) || 10,
        status,
      });

      if (result.total === 0) {
        return res.status(200).json({
          message: 'There are no feedbacks in the list.',
          count: 0,
          feedbacks: [],
        });
      }

      return res.status(200).json({
        message: 'Getting all feedbacks',
        count: result.total,
        totalPages: result.totalPages,
        page: result.page,
        feedbacks: result.feedbacks,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // GET /api/feedbacks/my (logged-in customer)
  async getMy(req, res) {
    try {
      // ✅ fixed: customer_id not _id
      const customerId = req.customer?.customer_id;

      if (!customerId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
      }

      const feedbacks = await feedbackService.getMyFeedbacks(customerId);
      const count = feedbacks.length;

      if (count === 0) {
        return res.status(200).json({
          message: 'You have not submitted any feedback yet.',
          count: 0,
          feedbacks: [],
        });
      }

      return res.status(200).json({
        message: 'Getting your feedbacks',
        count,
        feedbacks,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // GET /api/feedbacks/getbyid/:id
  async getById(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid feedback id' });
      }

      const feedback = await feedbackService.getFeedbackById(id);

      return res.status(200).json({
        message: 'Feedback fetched successfully',
        feedback,
      });
    } catch (err) {
      return res.status(404).json({ message: err.message });
    }
  }

  // PATCH /api/feedbacks/status/:id (admin)
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid feedback id' });
      }

      if (!status) {
        return res.status(400).json({ message: 'Status is required.' });
      }

      const allowed = ['pending', 'in_review', 'resolved'];
      if (!allowed.includes(status)) {
        return res.status(400).json({ message: `Status must be one of: ${allowed.join(', ')}` });
      }

      const feedback = await feedbackService.updateFeedbackStatus(id, status);

      return res.status(200).json({
        message: 'Feedback status updated successfully',
        feedback,
      });
    } catch (err) {
      return res.status(404).json({ message: err.message });
    }
  }

  // DELETE /api/feedbacks/delete/:id (admin)
  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid feedback id' });
      }

      const deletedFeedback = await feedbackService.deleteFeedback(id);

      return res.status(200).json({
        message: 'Feedback deleted successfully',
        deletedFeedback,
      });
    } catch (err) {
      if (err.message.includes('not found')) {
        return res.status(404).json({ message: err.message });
      }
      return res.status(500).json({ message: err.message });
    }
  }

  // ✅ PATCH /api/feedbacks/reply/:id
  async reply(req, res) {
    try {
      const { id } = req.params;
      const { reply } = req.body;
 
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid feedback id' });
      }
      if (!reply || !reply.trim()) {
        return res.status(400).json({ message: 'Reply message is required.' });
      }
 
      // worker username from auth middleware
      const workerUsername = req.customer?.username || req.worker?.username || 'Worker';
 
      const feedback = await feedbackService.replyToFeedback(id, reply, workerUsername);
      return res.status(200).json({ message: 'Reply sent successfully!', feedback });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

}

export default new FeedbackController();