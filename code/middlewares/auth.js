import jwt from "jsonwebtoken";
import bookingModel from "../models/booking.model.js"; 

// ================= AUTH =================
export const auth = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
//  verifying token

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.customer = decoded;   // attach customer info

        next();

    } catch (err) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};




// ================= authorize role =================
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {

        if (!req.customer) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        if (!roles.includes(req.customer.role)) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        next();
    };
};





// ================= REFRESH TOKEN =================
export const verifyRefreshToken = (req,res,next)=>{
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        const refreshToken = authHeader.split(" ")[1];
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        req.customer = decoded;
        req.refreshToken = refreshToken;

        next();


        // const { refreshToken}= req.body;
        // if(!refreshToken){
        //     return res.status(401).json({message: "no refresh token provided"})
        // }

        // const decoded= jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET)

        // req.user=decoded;
        //                             // req.customer = {
        //                             // customer_id: "abc123",
        //                             // iat: ...,
        //                             // exp: ...
        //                             // }

        // next();
    }
    catch(e){
        return res.status(403).json({message:"invalid or expire token"})
    }
}




// ================= autoCancelExpiredBookings =================
export const autoCancelExpiredBookings = async (req, res, next) => {

    try {

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        await bookingModel.updateMany(
            {
                travelDate: { $lt: today },
                status: { $ne: "CANCELLED" }
            },
            {
                $set: { status: "CANCELLED" }
            }
        );

        next();

    } catch (error) {

        return res.status(500).json({
            message: "Error updating expired bookings",
            error: error.message
        });
    }
};