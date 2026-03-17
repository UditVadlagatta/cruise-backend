import mongoose from "mongoose";
import bookingModel from "../models/booking.model.js";
import cruiseModel from '../models/cruise.model.js'
import customerModel from '../models/customer.model.js'

class BookingService{
//     async creatingBooking(data){
//         const {customer, cruise,travelDate,seatsBooked} = data;

//         // find cruise
//         const cruisedata = await cruiseModdel.findById(cruise);
//         if(!cruisedata){
//             throw new Error("Cruise not found")
//         }

//         // find customer
//         const customerdata = await customerModel.findById(customer); 
//         if(!customerdata){
//             throw new Error("Customer not found")
//         }

//         const travelParticularDate = new Date(data.travelDate);
//         travelParticularDate.setHours(0,0,0,0);
//         const today = new Date();
//         today.setHours(0,0,0,0);

//         if(travelParticularDate < today){
//             throw new Error ("travel date cannot be past")
//         }

//         const nextDay = new Date(travelParticularDate);
// nextDay.setDate(nextDay.getDate() + 1);

//         // calculation
//         const result = await bookingModel.aggregate([
//             {
//                 $match:{
//                     customer: new mongoose.Types.ObjectId(data.customer),
//                     cruise: new mongoose.Types.ObjectId(data.cruise),
//                     travelDate: {
//                 $gte: travelParticularDate,
//                 $lt: nextDay
//             }
//                 }
//             },{
//                 $group:{
//                     _id:null,
//                     totalSeats: {$sum: "$seatsBooked"}
//                 }
//             }
//         ])

//         console.log("booking per customer per cruise per day: ",result)

//         const totalSeatsBooked = result.length > 0 ? result[0].totalSeats : 0;
//         console.log("total seat booking: ",totalSeatsBooked)

//         if(totalSeatsBooked + data.seatsBooked> 5){
//             throw new Error("Maximum 5 seats allowed per customer per cruise on per day")
//         }


// // 2️⃣ Total cruise capacity check
// const totalCruiseBooked = await bookingModel.aggregate([
//     {
//         $match:{
//             cruise: new mongoose.Types.ObjectId(data.cruise),
//             travelDate: {
//                 $gte: travelParticularDate,
//                 $lt: nextDay
//             }
//         }
//     },
//     {
//         $group:{
//             _id:null,
//             totalSeats: {$sum: "$seatsBooked"}
//         }
//     }
// ])

// const totalBookedForCruise =
//     totalCruiseBooked.length > 0 ? totalCruiseBooked[0].totalSeats : 0;

// if(totalBookedForCruise + data.seatsBooked > cruisedata.capacity){
//     throw new Error("Not enough seats available for this cruise")
// }

//         const totalPrice = cruisedata.price * data.seatsBooked;

//         // const booking = await  bookingModel.create({
//         //     ...data,
//         //     totalPrice
//         // })

//         const booking = await bookingModel.create({
//     customer,
//     cruise,
//     travelDate: travelParticularDate,
//     seatsBooked,
//     totalPrice
// })

//         return await bookingModel
//     .findById(booking._id)
//     .populate("customer")
//     .populate("cruise");
//     }

// ...........................................................................................
// async validateBookingRules({ customer, cruise, travelDate, seatsBooked, excludeBookingId = null }) {

//     const cruiseData = await cruiseModdel.findById(cruise);
//     if (!cruiseData) throw new Error("Cruise not found");

//     const customerData = await customerModel.findById(customer);
//     if (!customerData) throw new Error("Customer not found");

//     // 🔥 Always normalize to UTC midnight safely
//     const travelParticularDate = new Date(travelDate);
//     travelParticularDate.setUTCHours(0, 0, 0, 0);

//     // Prevent past date
//     const today = new Date();
//     today.setUTCHours(0, 0, 0, 0);

//     if (travelParticularDate < today) {
//         throw new Error("Travel date cannot be in the past");
//     }

//     const nextDay = new Date(travelParticularDate);
//     nextDay.setUTCDate(nextDay.getUTCDate() + 1);

//     const commonMatch = {
//         cruise: new mongoose.Types.ObjectId(cruise),
//         travelDate: { $gte: travelParticularDate, $lt: nextDay },
//         ...(excludeBookingId && {
//             _id: { $ne: new mongoose.Types.ObjectId(excludeBookingId) }
//         })
//     };

//     // 1️⃣ Per customer limit (max 5)
//     const customerAgg = await bookingModel.aggregate([
//         { $match: { ...commonMatch, customer: new mongoose.Types.ObjectId(customer) } },
//         { $group: { _id: null, totalSeats: { $sum: "$seatsBooked" } } }
//     ]);

//     const totalCustomerSeats = customerAgg.length > 0 ? customerAgg[0].totalSeats : 0;

//     if (totalCustomerSeats + seatsBooked > 5) {
//         throw new Error("Maximum 5 seats allowed per customer per cruise per day");
//     }

//     // 2️⃣ Cruise capacity check
//     const cruiseAgg = await bookingModel.aggregate([
//         { $match: commonMatch },
//         { $group: { _id: null, totalSeats: { $sum: "$seatsBooked" } } }
//     ]);

//     const totalCruiseSeats = cruiseAgg.length > 0 ? cruiseAgg[0].totalSeats : 0;

//     if (totalCruiseSeats + seatsBooked > cruiseData.capacity) {
//         throw new Error("Not enough seats available for this cruise");
//     }

//     return cruiseData;
// }


//     async creatingBooking(data) {

//     const { customer, cruise, travelDate, seatsBooked } = data;

//     // 🔥 Create UTC midnight date properly
//     const [year, month, day] = travelDate.split("-");
//     const formattedDate = new Date(Date.UTC(year, month - 1, day));

//     const cruiseData = await this.validateBookingRules({
//         customer,
//         cruise,
//         travelDate: formattedDate,
//         seatsBooked
//     });

//     const booking = await bookingModel.create({
//         customer,
//         cruise,
//         travelDate: formattedDate,
//         seatsBooked,
//         totalPrice: cruiseData.price * seatsBooked
//     });

//     return await booking.populate(["customer", "cruise"]);
// }

//     async updateBooking(bkCode, updateData) {

//     const booking = await bookingModel.findOne({ bookingCode: bkCode });

//     if (!booking) {
//         throw new Error(`Booking not found ${bkCode}`);
//     }

//     const newSeats = updateData.seatsBooked ?? booking.seatsBooked;

//     if (newSeats <= 0) {
//         throw new Error("Seats must be at least 1");
//     }

//     let newTravelDate = booking.travelDate;

//     if (updateData.travelDate) {

//         // Case 1️⃣ If it's already Date object
//         if (updateData.travelDate instanceof Date) {

//             newTravelDate = new Date(updateData.travelDate);

//         } 
//         // Case 2️⃣ If it's string (YYYY-MM-DD or ISO)
//         else if (typeof updateData.travelDate === "string") {

//             const parsedDate = new Date(updateData.travelDate);

//             if (isNaN(parsedDate)) {
//                 throw new Error("Invalid travel date format");
//             }

//             newTravelDate = parsedDate;
//         }
//         else {
//             throw new Error("Invalid travel date type");
//         }

//         // 🔥 Always normalize to UTC midnight
//         newTravelDate.setUTCHours(0, 0, 0, 0);
//     }

//     const cruiseData = await this.validateBookingRules({
//         customer: booking.customer,
//         cruise: booking.cruise,
//         travelDate: newTravelDate,
//         seatsBooked: newSeats,
//         excludeBookingId: booking._id
//     });

//     booking.seatsBooked = newSeats;
//     booking.travelDate = newTravelDate;
//     booking.totalPrice = cruiseData.price * newSeats;

//     if (updateData.status) {
//         booking.status = updateData.status;
//     }

//     await booking.save();

//     return await booking.populate(["customer", "cruise"]);
// }

// ....................................................................................................

// 🔹 Validate Booking Rules
  


// ✅ Validate booking rules
  

// 🔹 Validate Booking Rules
async validateBookingRules({ customer, cruise, travelDate, seatsBooked, excludeBookingId = null }) {

  // 1️⃣ Check cruise exists
  const cruiseData = await cruiseModel.findById(cruise);
  if (!cruiseData) throw new Error("Cruise not found");

  // ✅ Calculate totalDistance and segmentPrice if not already present
  if (!cruiseData.route.totalDistance) {

    // Calculate total distance safely
    const totalDistance = cruiseData.route.segments.reduce((sum, seg) => (sum + seg.distance || 0), 0);
    if (totalDistance === 0) throw new Error("Cruise route segments have invalid distances");


    cruiseData.route.totalDistance = totalDistance;
    cruiseData.route.segments = cruiseData.route.segments.map(seg => {
      const priceFraction = seg.distance / totalDistance;
      return {
        ...seg,
        segmentPrice: Math.round(priceFraction * cruiseData.price)
      };
    });
    await cruiseData.save(); // persist updated segments
  }

  // 2️⃣ Check customer exists
  const customerData = await customerModel.findById(customer);
  if (!customerData) throw new Error("Customer not found");

  // 3️⃣ Normalize travel date to UTC midnight
  const travelParticularDate = new Date(travelDate);
  travelParticularDate.setUTCHours(0, 0, 0, 0);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  if (travelParticularDate < today) throw new Error("Travel date cannot be in the past");

  const nextDay = new Date(travelParticularDate);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);

  const commonMatch = {
    cruise: new mongoose.Types.ObjectId(cruise),
    travelDate: { $gte: travelParticularDate, $lt: nextDay },
    ...(excludeBookingId && { _id: { $ne: new mongoose.Types.ObjectId(excludeBookingId) } })
  };

  // 4️⃣ Customer limit per cruise per day (max 5 seats)
  const customerAgg = await bookingModel.aggregate([
    { $match: { ...commonMatch, customer: new mongoose.Types.ObjectId(customer) } },
    { $group: { _id: null, totalSeats: { $sum: "$seatsBooked" } } }
  ]);
  const totalCustomerSeats = customerAgg.length > 0 ? customerAgg[0].totalSeats : 0;
  if (totalCustomerSeats + seatsBooked > 5) throw new Error("Maximum 5 seats allowed per customer per cruise per day");

  // 5️⃣ Cruise capacity check
  const cruiseAgg = await bookingModel.aggregate([
    { $match: commonMatch },
    { $group: { _id: null, totalSeats: { $sum: "$seatsBooked" } } }
  ]);
  const totalCruiseSeats = cruiseAgg.length > 0 ? cruiseAgg[0].totalSeats : 0;
  if (totalCruiseSeats + seatsBooked > cruiseData.capacity) throw new Error("Not enough seats available for this cruise");

  return cruiseData;
}

// 🔹 Create Booking
async creatingBooking(data) {
  const { customer, cruise, travelDate, seatsBooked, boardingPoint, dropPoint } = data; 

  if (!boardingPoint || !dropPoint) throw new Error("boardingPoint and dropPoint are required");

  // Normalize travelDate to UTC midnight
  let formattedDate;
  if (typeof travelDate === "string") {
    const [year, month, day] = travelDate.split("-");
    formattedDate = new Date(Date.UTC(year, month - 1, day));
  } else if (travelDate instanceof Date) {
    formattedDate = new Date(travelDate);
  } else throw new Error("Invalid travelDate type");
  formattedDate.setUTCHours(0, 0, 0, 0);

  // Validate booking rules
  const cruiseData = await this.validateBookingRules({ customer, cruise, travelDate: formattedDate, seatsBooked });

  const segments = cruiseData.route.segments;

  // Find segment indexes
  const startIndex = segments.findIndex(s => s.from === boardingPoint);
  const endIndex = segments.findIndex(s => s.to === dropPoint);

  if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
    throw new Error("Invalid boardingPoint or dropPoint selection");
  }

  const selectedSegments = segments.slice(startIndex, endIndex + 1);

  // Calculate totalDistance safely
  const totalDistance = segments.reduce((sum, seg) => sum + (seg.distance || 0), 0);
  if (totalDistance === 0) throw new Error("Cruise route segments have invalid distances");

  // Calculate total price dynamically based on distance
  const totalSegmentPrice = selectedSegments.reduce((sum, seg) => {
    const segPrice = ((seg.distance || 0) / totalDistance) * cruiseData.price;
    return sum + segPrice;
  }, 0);

  const totalPrice = Math.round(totalSegmentPrice * seatsBooked);

  // Create booking
  const booking = await bookingModel.create({
    customer,
    cruise,
    travelDate: formattedDate,
    seatsBooked,
    boardingPoint,
    dropPoint,
    totalPrice
  });

  return await booking.populate(["customer", "cruise"]);
}

// 🔹 Update Booking
async updateBooking(bkCode, updateData) {
  const booking = await bookingModel.findOne({ bookingCode: bkCode });
  if (!booking) throw new Error(`Booking not found ${bkCode}`);

  const newSeats = updateData.seatsBooked ?? booking.seatsBooked;
  if (newSeats <= 0) throw new Error("Seats must be at least 1");

  // Normalize travelDate if updated
  let newTravelDate = booking.travelDate;
  if (updateData.travelDate) {
    if (updateData.travelDate instanceof Date) newTravelDate = new Date(updateData.travelDate);
    else if (typeof updateData.travelDate === "string") {
      const [year, month, day] = updateData.travelDate.split("-");
      newTravelDate = new Date(Date.UTC(year, month - 1, day));
    } else throw new Error("Invalid travel date type");
    newTravelDate.setUTCHours(0, 0, 0, 0);
  }

  const boardingPoint = updateData.boardingPoint ?? booking.boardingPoint;
  const dropPoint = updateData.dropPoint ?? booking.dropPoint;

  const cruiseData = await this.validateBookingRules({
    customer: booking.customer,
    cruise: booking.cruise,
    travelDate: newTravelDate,
    seatsBooked: newSeats,
    excludeBookingId: booking._id
  });

  const segments = cruiseData.route.segments;
  const startIndex = segments.findIndex(s => s.from === boardingPoint);
  const endIndex = segments.findIndex(s => s.to === dropPoint);

  if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
    throw new Error("Invalid boardingPoint or dropPoint selection");
  }

  const selectedSegments = segments.slice(startIndex, endIndex + 1);

  // Calculate totalDistance safely
  const totalDistance = segments.reduce((sum, seg) => sum + (seg.distance || 0), 0);
  if (totalDistance === 0) throw new Error("Cruise route segments have invalid distances");

  // Calculate total price dynamically
  const totalSegmentPrice = selectedSegments.reduce((sum, seg) => {
    const segPrice = ((seg.distance || 0) / totalDistance) * cruiseData.price;
    return sum + segPrice;
  }, 0);

  booking.seatsBooked = newSeats;
  booking.travelDate = newTravelDate;
  booking.boardingPoint = boardingPoint;
  booking.dropPoint = dropPoint;
  booking.totalPrice = Math.round(totalSegmentPrice * newSeats);

  if (updateData.status) booking.status = updateData.status;

  await booking.save();

  return (await booking.populate(["customer", "cruise"])).populate("payment");
}

//   ....................................... GET ALL BOOKING .........................................................
async getAllBooking() {

    const bookings = await bookingModel
        .find()
        .populate("customer", "-password -refreshToken")
        .populate("cruise")
        .populate('payment')
        .sort({ createdAt: -1 }); // newest first

    return bookings;
}

//   ....................................... GET BOOKING BY ID .........................................................
async getBookingById(bookingId) {

    const booking = await bookingModel
        .findById(bookingId)
        .populate("customer", "-password -refreshToken")
        .populate("cruise");

    return booking;
}

//   ....................................... DELETE BOOKING .........................................................
async deleteBookingByCode(bookingCode) {

    if (!bookingCode) {   //bookingCode required
        throw new Error("Booking code is required");
    }

    const booking = await bookingModel.findOne({ bookingCode });  //bookingCode required

    if (!booking) {
        throw new Error(`Booking not found with code ${bookingCode}`);
    }

    // Optional Business Rule:
    // Prevent deleting confirmed booking
    if (booking.status === "CONFIRMED") {
        throw new Error("Confirmed booking cannot be deleted");
    }

    await bookingModel.deleteOne({ bookingCode });

    return booking;
}

//   ....................................... CONFIRM BOOKING .........................................................
async confirmedBooking(bookingCode){
    // if(!bkCode){
    //     throw new Error("Booking Code is required");
    // }

    const booking = await bookingModel.findOne({bookingCode});
    if(!booking){
        throw new Error(`Booking not found with id: ${bookingCode}`)
    }

    if(booking.status === "CONFIRMED"){
        throw new Error("Already CONFIRMED, cannot be CONFIRMED again!")
    }
    if((booking.status === "CANCELLED")){
        throw new Error("CANCELLED booking cannot be CONFIRMED!")
    }

    booking.status = "CONFIRMED";

    await booking.save();

    await booking.populate(["customer","cruise"])

    return booking;
}

//   ....................................... CANCELLED BOOKING .........................................................

async cancelledBooking(bookingCode){
    const booking = await bookingModel.findOne({bookingCode});

    if(!bookingCode){
        throw new Error(`Booking not found with id: ${bookingCode}`)
    }

    if(booking.status === "CANCELLED"){
        throw new Error("Already CANCELLED, cannot be CANNCELLED again!")
    }

    if(booking.status === "CONFIRMED"){
        booking.cancellationReason="CANCELLED requested by customer"
        await booking.save();
        // throw new Error("cannot cancelled immediately but your feedback reach to us")
        await booking.populate(["customer","cruise"])
        return booking
    }
    else {
    // PENDING booking
    booking.status = "CANCELLED";
  }

    await booking.save();

    await booking.populate(["customer","cruise"])

    return booking;
}

//   ....................................... cruiseId, travelDate .........................................................

//     async getCruiseDateStatus({ cruiseId, travelDate }) {

//   const cruise = await cruiseModel.findById(cruiseId);
//   if (!cruise) throw new Error("Cruise not found");

//   // Normalize date
//   const [year, month, day] = travelDate.split("-");
//   const selectedDate = new Date(Date.UTC(year, month - 1, day));
//   selectedDate.setUTCHours(0, 0, 0, 0);

//   const nextDay = new Date(selectedDate);
//   nextDay.setUTCDate(nextDay.getUTCDate() + 1);

//   // 🔹 Find bookings with populate
//   const bookings = await bookingModel
//     .find({
//       cruise: cruiseId,
//       travelDate: { $gte: selectedDate, $lt: nextDay }
//     })
//     .populate("customer")
//     .populate("cruise");

//   // Calculate seats
//   const bookedSeats = bookings.reduce(
//     (sum, booking) => sum + booking.seatsBooked,
//     0
//   );
// if (bookedSeats > cruise.capacity) {
//   console.warn("Overbooking detected for cruise:", cruiseId);
// }
// const isOverbooked = bookedSeats > cruise.capacity? "Overbooking detected for cruise": "seats are available";

//   const availableSeats = cruise.capacity - bookedSeats;
// // const availableSeats = Math.max(cruise.capacity - bookedSeats, 0);
//   // Date status
//   const today = new Date();
//   today.setUTCHours(0, 0, 0, 0);

//   let dateStatus;
//   if (selectedDate < today) dateStatus = "PAST";
// //   else if (selectedDate.getTime() === today.getTime()) dateStatus = "TODAY";
// // else if(selectedDate == today)dateStatus = "TODAY";
//   else dateStatus = "TODAY";

//   return {
//     cruiseId,
//     cruiseName: cruise.name,
//     cruiseStatus: cruise.status,
//     travelDate,
//     dateStatus,
//     capacity: cruise.capacity,
//     bookedSeats,
//     availableSeats,
//     isOverbooked,
//     bookings   // 👈 populated bookings
//   };
// }

async getCruiseDateStatus({ cruiseId, travelDate }) {

  const [year, month, day] = travelDate.split("-");
  const selectedDate = new Date(Date.UTC(year, month - 1, day));
  selectedDate.setUTCHours(0,0,0,0);

  const nextDay = new Date(selectedDate);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);

  // Get cruises
  let cruises;

  if (cruiseId) {
    const cruise = await cruiseModel.findById(cruiseId);
    if (!cruise) throw new Error("Cruise not found");
    cruises = [cruise];
  } else {
    cruises = await cruiseModel.find();
  }

  const results = [];

  for (const cruise of cruises) {

    const bookings = await bookingModel
      .find({
        cruise: cruise._id,
        travelDate: { $gte: selectedDate, $lt: nextDay }
      })
      .populate("customer")
      .populate("cruise");

    const bookedSeats = bookings.reduce(
      (sum, booking) => sum + booking.seatsBooked,
      0
    );

    const availableSeats = cruise.capacity - bookedSeats;

    const isOverbooked =
      bookedSeats > cruise.capacity
        ? "Overbooking detected"
        : "Seats available";

    const today = new Date();
    today.setUTCHours(0,0,0,0);

    let dateStatus;

    if (selectedDate < today) dateStatus = "PAST";
    else if (selectedDate.getTime() === today.getTime()) dateStatus = "TODAY";
    else dateStatus = "UPCOMING";

    results.push({
      cruiseId: cruise._id,
      cruiseName: cruise.name,
      cruiseStatus: cruise.status,
      travelDate,
      dateStatus,
      capacity: cruise.capacity,
      bookedSeats,
      availableSeats,
      isOverbooked,
      bookings
    });
  }

  return results;
}

// .......................
async getTotalRevenue ()  {
  try {

    const result = await Payment.aggregate([
      {
        $match: { status: "SUCCESS" }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" }
        }
      }
    ]);

    return result[0]?.totalRevenue || 0;

  } catch (error) {
    throw error;
  }
};



}

export default new BookingService()