import paymentService from '../services/payment.service.js'

class PaymentController{
  
//     async createPayment(req, res){
//             try {

// // console.log("BODY:", req.body);   

//       const payment = await paymentService.createPayment({
//         bookingCode: req.body.bookingCode,
//         cruiseId: req.body.cruiseId,
//         customerId: req.body.customerId,
//         paymentMethod: req.body.paymentMethod,
//         transactionId: req.body.transactionId,
//         paymentProof: req.body.paymentProof
//       });
 
//       res.status(201).json({
//         message: "Payment submitted successfully. Awaiting for verification and status will updated soon...",
//         payment
//       });

//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
// }

async createPayment(req, res) {
  try {

    const payment = await paymentService.createPayment({
      bookingCode: req.body.bookingCode,
      paymentMethod: req.body.paymentMethod,
      transactionId: req.body.transactionId,
      paymentProof: req.file?.path
    });

    res.status(201).json({
      message:
        "Payment submitted successfully. Awaiting verification and status will be updated soon...",
      payment
    });

  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
}
// .............................................  Admin verifies payment ..........................................
  async verifyPayment(req, res) {
    try {

      const payment = await paymentService.verifyPayment({
        paymentId: req.params.paymentId,
        // adminId: req.user._id,
        status: req.body.status,
        remarks: req.body.remarks
      });

      res.json({
        message: "Payment verified successfully",
        payment
      });

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

// ..................................... Get all payment ..............................................
  async getAll(req,res){
    try{
      const payment = await paymentService.getAllBooking();
      res.status(201).json({message:"Getting all bookings...",payment})
    }
    catch(err){
        const statusCode =
        err.message === "Booking already exists"
            ? 400
            : 500;

    return res.status(statusCode).json({
        message: err.message
    })
    }
  }

// ..................................... Get payment by bookingCode ..............................................
  async getPaymentByBooking(req, res) {
    try {

      const payment = await paymentService.getPaymentByBookingCode(
        req.params.bookingCode
      );

      res.json(payment);

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateRemark(req, res) {
  try {

    const payment = await paymentService.updateRemark({
      paymentId: req.params.paymentId,
      remarks: req.body.remarks
    });

    res.json({
      message: "Remark updated successfully",
      payment
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

}

export default new PaymentController();