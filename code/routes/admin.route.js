import express from 'express';
import adminController from '../controllers/admin.controller.js';
import {auth,authorizeRoles,verifyRefreshToken} from '../middlewares/auth.js'


const router = express.Router();

router.post('/register',adminController.register);

// 🔹 Worker login
router.post("/login", adminController.login);
router.post("/refresh", verifyRefreshToken, adminController.refresh);

 // 🔹 Get single admin
 router.get(
   "/getbyid/:id",
 //   verifyToken,
 //   authorizeRoles("ADMIN"),
   adminController.getById
 );

 // 🔹 Update worker
 router.put(
   "/update/:id",
 //   verifyToken,
 //   authorizeRoles("ADMIN"),
   adminController.update
 );
 

export default router;