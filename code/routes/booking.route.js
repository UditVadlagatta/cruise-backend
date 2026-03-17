import express from 'express'
import bookingController from '../controllers/booking.controller.js'
import {autoCancelExpiredBookings} from '../middlewares/auth.js'
// import paymentRoutes from './payment.route.js'
import {auth,authorizeRoles,verifyRefreshToken} from '../middlewares/auth.js'

const router = express.Router();


router.get('/getall'
    // ,auth,authorizeRoles("admin","customer")
    ,autoCancelExpiredBookings,bookingController.getAll);
router.post('/create',bookingController.create);
router.get('/getbyid/:bookingid'
    // ,auth,authorizeRoles("admin")
    ,bookingController.getById);
router.put('/update/:bookingCode',bookingController.update);
router.delete("/delete/:bookingCode", bookingController.deleteByCode);

router.get('/cfmbk/:bookingCode',bookingController.confirmStatus)
router.get('/cnlbk/:bookingCode',bookingController.cancelStatus)

router.get('/revenue', bookingController.getTotalRevenue);




// GET /api/bookings/status?cruiseId=xxx&travelDate=2026-03-01
router.get('/status/',bookingController.getCruiseDateStatus)

// router.put('/remark/:paymentId', paymentController.updateRemark);

export default router;