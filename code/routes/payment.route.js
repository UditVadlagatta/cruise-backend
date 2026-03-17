import express from 'express'
import paymentController from '../controllers/payment.controller.js'
import upload from '../middlewares/paymentUpload.js'
import paymentUpload from '../middlewares/paymentUpload.js';

const router = express.Router();



// Create Payment with screenshot upload
router.post(
  "/create",
  paymentUpload.single("paymentProof"),
  paymentController.createPayment
);


// router.post('/create',paymentController.createPayment);
router.put('/verify/:paymentId',paymentController.verifyPayment);
router.get('/bookingpay/:bookingCode',paymentController.getPaymentByBooking);
router.get('/getAll',paymentController.getAll);


router.put('/remark/:paymentId', paymentController.updateRemark);



export default router;