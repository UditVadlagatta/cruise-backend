import express from "express"
import mongoose from "mongoose"
import dotenv from 'dotenv'
import cors from 'cors';
import customerRoute from './routes/customer.route.js';
import cruiseRoute from './routes/cruise.route.js'
import bookingRoute from './routes/booking.route.js'
import paymentRoute from './routes/payment.route.js'
import workerRoute from './routes/worker.route.js'

dotenv.config();
const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGOOSE_URL)
.then(()=>{
    console.log("mongoose connected successfully!");
});

// Enable CORS for all routes
app.use(cors());
app.use("/uploads", express.static("uploads"));
// app.use("/uploads/payments", express.static("uploads/payments"));

// const allowedOrigins = ['http://http://localhost:5173', 'https://your-frontend.com'];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true); // allow Postman or curl requests
//     if (allowedOrigins.indexOf(origin) === -1) {
//       return callback(new Error('Not allowed by CORS'), false);
//     }
//     return callback(null, true);
//   },
//   credentials: true, // allow cookies if needed
// }));


 
app.use('/api/customers',customerRoute);
app.use('/api/cruises',cruiseRoute)
app.use('/api/bookings',bookingRoute)
app.use('/api/payments',paymentRoute)
app.use('/api/workers',workerRoute)

const PORT= process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`server connected with PORT ${PORT}`)
})