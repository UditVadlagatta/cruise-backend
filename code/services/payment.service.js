import paymentModel  from '../models/payment.model.js'
import bookingModel from '../models/booking.model.js'
import cruiseModel from '../models/cruise.model.js';

class PaymentService{

     // 🔹 Create Payment (Customer)
    // async createPayment(data) {
    //     const { bookingCode, customerId, cruiseId, paymentMethod, transactionId, paymentProof } = data;
    //     if (!bookingCode) throw new Error("Booking ID is required");
    //     const booking = await bookingModel.findOne({bookingCode}).populate("cruise");

    //     if (!booking) throw new Error("Booking not found");
    //     if (booking.status === "CANCELLED"){
    //       throw new Error("Cannot pay for cancelled booking");
    //     }
        

    //     const cruise= await cruiseModel.findById(data.cruiseId)
    //     console.log(cruise)
    //     if(!cruise) throw new Error("Booking not found");

    //     // Prevent duplicate successful payment
    // const existingPayment = await paymentModel.findOne({
    //   booking: booking._id,
    //   status: "SUCCESS"
    // });

    // if (existingPayment)
    //   throw new Error("Payment already completed for this booking");

    

    // const payment = await paymentModel.create({
    //   booking: booking._id,
    //   // bookingCode,
    //   customer: customerId,
    //   cruise:cruiseId,
    //   amount: booking.totalPrice,
    //   paymentMethod,
    //   transactionId,
    //   paymentProof,
    //   status: "PENDING"
    // });

    // // Attach payment reference to booking
    // booking.payment = payment._id;
    // // payment.cruise= booking.cruise;
    // await booking.save();

    // // return payment;
    // const populatePayment = await paymentModel.findById(payment._id)
    //                         .populate("booking", "bookingCode totalPrice travelDate")
    //                         .populate("customer", "username email")
    //                         .populate("cruise");

    // return populatePayment;
    // }
    async createPayment(data) {

  const { bookingCode, paymentMethod, transactionId, paymentProof } = data;

  if (!bookingCode) {
    throw new Error("Booking Code is required");
  }

  const booking = await bookingModel
    .findOne({ bookingCode })
    .populate("cruise")
    .populate("customer");

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.status === "CANCELLED") {
    throw new Error("Cannot pay for cancelled booking");
  }

  // Prevent duplicate successful payment
  const existingPayment = await paymentModel.findOne({
    booking: booking._id,
    status: "SUCCESS"
  });

  if (existingPayment) {
    throw new Error("Payment already completed for this booking");
  }

  const payment = await paymentModel.create({
    booking: booking._id,
    customer: booking.customer._id,
    cruise: booking.cruise._id,
    amount: booking.totalPrice,
    paymentMethod,
    transactionId,
    paymentProof,
    status: "PENDING"
  });

  // attach payment to booking
  booking.payment = payment._id;
  await booking.save();

  const populatePayment = await paymentModel
    .findById(payment._id)
    .populate("booking", "bookingCode totalPrice travelDate")
    .populate("customer", "username email")
    .populate("cruise", "name price");

  return populatePayment;
}

// .............................................  Admin verifies payment ..........................................
  async verifyPayment({ paymentId, adminId, status, remarks }){
    const payment = await paymentModel.findById(paymentId);
    if (!payment) throw new Error("Payment not found");

    if (payment.status === "SUCCESS")
      throw new Error("Payment already verified");

    const booking = await bookingModel.findById(payment.booking);
    if (!booking) throw new Error("Linked booking not found");
    // booking.status="CONFIRMED";

    if (status === "SUCCESS") {

      payment.status = "SUCCESS";
      payment.paidAt = new Date();
      // payment.verifiedBy = adminId;

      // 🔥 Auto confirm booking
      // booking.status = "CONFIRMED";
      await booking.save();

    } else {
      payment.status = "REJECTED";
    }

    payment.remarks = remarks;
    // await payment.save();

    // return (await (await payment.populate("customer")).populate("booking").populate("cruise"));

    await payment.save();

return await paymentModel
  .findById(payment._id)
  .populate("customer")
  .populate("booking")
  .populate({
    path: "booking",
    populate: {
      path: "cruise"
    }
  });
  }

  // .......................................... GET ..............................................
//   async getAllBooking (){
//     const payments = await paymentModel.find().populate("customer").populate("booking");
//     const booking = await bookingModel.find();
//     if (!booking) throw new Error("Booking not found");
//     const cruise = await cruiseModel.findById(booking.cruise);
// const cruiseName = cruise ? cruise.name : null;

// console.log("----------------------------")
// console.log(cruiseName);

//     // return payments;
//     return{        ...payments.toObject(),
//         cruiseName: cruiseName};
//   }

async getAllBooking() {

  const payments = await paymentModel
    .find()
    .populate("customer")
    .populate({
      path: "booking",
      populate: {
        path: "cruise",
        select: "name"
      }
    });

  return payments;
} 

// ........................................................................
  // 🔹 Get payment by bookingCode
  async getPaymentByBookingCode(bookingCode) {

    const booking = await bookingModel.findOne({ bookingCode });
    if (!booking) throw new Error("Booking not found");
// const cruise = booking.cruise.name; // now accessible
const cruise = await cruiseModel.findById(booking.cruise);
const cruiseName = cruise ? cruise.name : null;

console.log("----------------------------")

console.log(cruiseName);


    const payment= await paymentModel.findOne({ booking: booking._id })
      .populate("booking")
      .populate("customer");

      if (!payment) {
    return {
      message: "No payment found for this booking",
      payment: null
    };
  }

  // return payment;
  return {        ...payment.toObject(),
        cruiseName: cruiseName};

  

  }


  async updateRemark({ paymentId, remarks }) {

  const payment = await paymentModel.findById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  payment.remarks = remarks;

  await payment.save();

  return await paymentModel
    .findById(payment._id)
    .populate("customer")
    .populate({
      path: "booking",
      populate: {
        path: "cruise"
      }
    });

}

} 

export default new PaymentService();