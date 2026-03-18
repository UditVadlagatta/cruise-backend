// import { required } from "joi";
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },

    email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["admin"],  
    default: "admin"
  },

  refreshToken:{
        type:String
    },
}, { timestamps: true })

export default mongoose.model("Admin",adminSchema);