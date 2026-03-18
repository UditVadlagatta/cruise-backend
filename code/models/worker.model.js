import mongoose from "mongoose";

const workerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
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
    enum: ["worker"],
    default: "worker"
  },

  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    default: "ACTIVE",
  },
  
  plainPassword: {
    type: String,
    select: false
},

  refreshToken:{
        type:String
    }

}, { timestamps: true });

export default mongoose.model("Worker", workerSchema);