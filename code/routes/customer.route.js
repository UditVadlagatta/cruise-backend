import express from 'express';
import customerController from '../controllers/customer.controller.js';
import {auth,authorizeRoles,verifyRefreshToken} from '../middlewares/auth.js'

const router = express.Router();
router.post('/login',customerController.loginCustomer);
router.get('/getall' 
    ,auth,authorizeRoles("admin","customer", "worker")
,customerController.getAll);
router.get('/getbyid/:id',customerController.getById);
router.post('/create',customerController.create);
router.put('/update/:id',customerController.update);
router.delete('/delete/:id',customerController.delete)
router.post("/refresh", verifyRefreshToken, customerController.refresh);


router.put("/status/:id", customerController.updateStatus);

export default router;   