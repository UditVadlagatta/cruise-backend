// import { required } from 'joi'
import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Customer",
        required:true
    },
    cruise:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Cruise",
        required:true
    },
    travelDate:{
        type:Date,
        required:true,
    },
    seatsBooked:{
        type:Number,
        required:true,
        default:0,
        min:1,
        max:5,
    },
    bookingCode: {
        type: String,
        unique: true,
        default: () => 'BK-' + Math.floor(100000 + Math.random() * 900000)  //eg: BK987654
    },
    boardingPoint: {      // NEW FIELD
        type: String,
        required: true,
    },
    dropPoint: {         // NEW FIELD
        type: String,
        required: true,
    },

    status:{
        type:String,
        enum:["PENDING","CONFIRMED","CANCELLED"],
        default:'PENDING'
    },
    totalPrice:{
        type:Number,
        required:true,
        min:0
    },
    payment: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Payment"
},
    cancellationReason :{
        type:String
    }
},{
    timestamps:true
})

export default mongoose.model('Booking',bookingSchema);