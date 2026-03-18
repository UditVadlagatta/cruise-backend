import express from "express"
import mongoose from "mongoose"
import dotenv from 'dotenv'
import cors from 'cors';
import customerRoute from './routes/customer.route.js';
import cruiseRoute from './routes/cruise.route.js'
import bookingRoute from './routes/booking.route.js'
import paymentRoute from './routes/payment.route.js'
import workerRoute from './routes/worker.route.js'
import adminRoute from './routes/admin.route.js'
import feedbackRoute from './routes/feedback.route.js'
import contactRouter from './routes/contact.routes.js';

dotenv.config(); 
const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000", 
    "https://cruise-booking-app.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// app.options("/(.*)", cors(corsOptions)); // ✅ Handle preflight FIRST
app.use(cors(corsOptions));          // ✅ Apply CORS to all routes

app.use(express.json());

mongoose.connect(process.env.MONGOOSE_URL)
.then(()=>{
    console.log("mongoose connected successfully!");
});

app.use("/uploads", express.static("uploads"));

app.use('/api/customers', customerRoute);
app.use('/api/cruises', cruiseRoute);
app.use('/api/bookings', bookingRoute);
app.use('/api/payments', paymentRoute);
app.use('/api/workers', workerRoute);
app.use('/api/admins',adminRoute);
app.use('/api/contacts', contactRouter);

app.use('/api/feedbacks',feedbackRoute)

// app.use('/api/admins', adminRoute)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server connected with PORT ${PORT}`)
});