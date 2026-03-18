import express from 'express';
import feedbackController from '../controllers/feedback.controller.js';
import { auth, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

// 🔹 Customer submit feedback
router.post(
  '/create',
  auth,
//   authorizeRoles('customer'),
  feedbackController.create.bind(feedbackController)
);

// 🔹 Customer get their own feedbacks
router.get(
  '/my',
  auth,
//   authorizeRoles('customer'),
  feedbackController.getMy.bind(feedbackController)
);

// 🔹 Admin get all feedbacks
router.get(
  '/getall',
//   auth,
//   authorizeRoles('ADMIN'),
  feedbackController.getAll.bind(feedbackController)
);

// 🔹 Admin get single feedback
router.get(
  '/getbyid/:id',
//   auth,
//   authorizeRoles('ADMIN'),
  feedbackController.getById.bind(feedbackController)
);

// 🔹 Admin update feedback status
router.patch(
  '/status/:id',
//   auth,
//   authorizeRoles('ADMIN'),
  feedbackController.updateStatus.bind(feedbackController)
);

// 🔹 Admin delete feedback
router.delete(
  '/delete/:id',
//   auth,
//   authorizeRoles('ADMIN'),
  feedbackController.delete.bind(feedbackController)
);

// ✅ Worker reply to feedback
router.patch('/reply/:id',  feedbackController.reply.bind(feedbackController));
 

export default router;