import express from 'express';
import contactController from '../controllers/contact.controller.js';
import { auth, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

// ✅ public — anyone can send a message
router.post('/create', contactController.create);

// ✅ admin only — view all messages
router.get('/getall', auth, authorizeRoles("admin" ,"worker"), contactController.getAll);

// ✅ admin only — delete a message
router.delete('/delete/:id', auth, authorizeRoles("admin"), contactController.deleteById);

export default router;