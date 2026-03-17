import express from 'express';
import cruiseController from '../controllers/cruise.controller.js';
import {auth,authorizeRoles,verifyRefreshToken} from '../middlewares/auth.js'
import upload from "../middlewares/upload.js";

const router = express.Router();
router.post('/create',upload.single("image"),cruiseController.create);
router.get('/getall'
    ,auth,authorizeRoles("admin","customer","worker")
    ,cruiseController.getAll);

router.get('/getbyid/:id',cruiseController.getById);

router.put('/update/:id',upload.single("image"),cruiseController.update); 
router.delete('/delete/:id',cruiseController.delete);

router.put(
"/update-image/:id",
upload.single("image"),
cruiseController.updateCruiseImage
);

export default router;