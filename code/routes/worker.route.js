import express from 'express';
import workerController from '../controllers/worker.controller.js';
import {auth,authorizeRoles,verifyRefreshToken} from '../middlewares/auth.js'

const router = express.Router();
router.post('/register',workerController.register);

// 🔹 Admin get all workers
router.get(
  "/getall",
//   verifyToken,
//   authorizeRoles("ADMIN"),
  workerController.getAll
);

// 🔹 Get single worker
router.get(
  "/getbyid/:id",
//   verifyToken,
//   authorizeRoles("ADMIN"),
  workerController.getById
);

// 🔹 Deactivate worker
router.put(
  "/deactivate/:id",
//   verifyToken,
//   authorizeRoles("ADMIN"),
  workerController.deactivate
);


// 🔹 Worker login
router.post("/login", workerController.login);
router.post("/refresh", verifyRefreshToken, workerController.refresh);

// 🔹 Update worker
router.put(
  "/update/:id",
//   verifyToken,
//   authorizeRoles("ADMIN"),
  workerController.update
);



export default router;