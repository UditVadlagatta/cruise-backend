import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique: true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true

    }, 
    password:{
        type:String,
        required:true,
        select:false
    },
    role:{
        type:String,
        enum:["admin", "worker", "customer"],
        // default:"customer"
    },
    status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    default: "ACTIVE",
  },
    refreshToken:{
        type:String
    }

},{
    timestamps:true
})

export default mongoose.model("Customer",customerSchema);