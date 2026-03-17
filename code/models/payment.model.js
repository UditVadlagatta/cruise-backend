import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    cruise:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cruise",
      // required: true
    },

    amount: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ["UPI", "GOOGLEPAY", "CASH", "PHONEPAY"],
      required: true
    },

    transactionId: {
      type: String,
      required: false // Optional for manual entry
    },

    paymentProof: {
      type: String // store image path (screenshot upload)
    },

    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "REJECTED", "RETURN-BACK"],
      default: "PENDING"
    },

    paidAt: {
      type: Date
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    remarks: {
      type: String
    },

    
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);