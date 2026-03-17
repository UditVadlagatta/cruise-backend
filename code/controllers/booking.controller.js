import mongoose from "mongoose";
import bookingService from "../services/booking.service.js";
import {registerBookingJoi,updateBookingJoi} from '../validators/booking.validator.js'

class BookingController{
    async create(req,res){
        try{
            const {error,value}= registerBookingJoi.validate(req.body)
            if(error){
                return res.status(400).json({message:error.details[0].message})
            }


            const booking = await bookingService.creatingBooking(value);

            res.status(201).json({message:"Booking done successfully!",booking})
        }
        catch(err){
    const statusCode =
        err.message === "Booking already exists"
            ? 400
            : 500;

    return res.status(statusCode).json({
        message: err.message
    })
}
        
    }


    async getAll(req,res){
        try{
            const bookings= await bookingService.getAllBooking();
            const count= bookings.length;

            if(count === 0){
                return res.status(200).json({
                    message:"there is no booking in the list",
                    count:0,
                    bookings:[]
                 })
                }
            res.status(200).json({
                message:"Getting all bookings",
                count:count,
                bookings
            })
        }
        catch(e){
            res.status(500).json({message:e.message})
        }
    }

    async getById(req,res){
        try{
            const {bookingid}= req.params;  // mongoose's id need
            if(!mongoose.Types.ObjectId.isValid(bookingid)){
                return res.status(400).json({message:"invalid booking id"})
            }

            const booking= await bookingService.getBookingById(bookingid);
            if(!booking){
                return res.status(404).json({message:"booking not found"})
            }
            res.status(200).json({message:"booking done successfully",booking})
        }
        catch(e){
            res.status(500).json({message:e.message})
        }
    }


    async update(req,res){
        try{
            const {bookingCode} = req.params;

            const { error, value } = updateBookingJoi.validate(req.body);

            if (error) {
            return res.status(400).json({
                message: error.details.map(err => err.message)
            });
        }
            
            const updateBooking= await bookingService.updateBooking(bookingCode,value);
            res.status(200).json({message:"Booking updated successfully",updBooking:updateBooking})
        }catch(e){
            res.status(404).json({ message: e.message })
        }

    }


    async deleteByCode(req, res) {
    try {

        const { bookingCode } = req.params;

        if (!bookingCode) {
            return res.status(400).json({
                message: "Booking code is required"
            });
        }

        const deletedBooking = await bookingService.deleteBookingByCode(bookingCode);

        res.status(200).json({
            message: "Booking deleted successfully",
            deletedBooking
        });

    } catch (e) {

        if (e.message.includes("not found")) {
            return res.status(404).json({ message: e.message });
        }

        res.status(500).json({ message: e.message });
    }
}
    async confirmStatus(req,res){
        try{
            const { bookingCode} = req.params;

            if(!bookingCode){
                return res.status(400).json({
                    message: "Booking code is required"
                })
            }

            const cmfbk = await bookingService.confirmedBooking(bookingCode);

            res.status(200).json({
                message: "Booking is CONFRIMED successfully!",cmfbk
            })
        }
        catch(e){
            res.status(500).json({message: e.message})
        }
    }

    async cancelStatus(req,res){
        try{
            const {bookingCode} = req.params;
            
            if(!bookingCode){
                return res.status(400).json({
                    message:"Booking code is reequired"
                })
            }

            const cnlbk = await bookingService.cancelledBooking(bookingCode);

            res.status(200).json({
                message:"Booking is CANCELLED successfully!",cnlbk
            })
        }
        catch(e){
            res.status(500).json({message: e.message})
        }
    }

    async getTotalRevenue  (req, res)  {
  try {

    const totalRevenue = await bookingService.getTotalRevenue();

    res.status(200).json({
      message: "Total revenue fetched successfully",
      totalRevenue
    });

  } catch (error) {
    console.error("Revenue Error:", error);

    res.status(500).json({
      message: "Error calculating revenue",
      error: error.message
    });
  }
};



    // async getCruiseDateStatus(req,res){
    //     try{
    //         const { cruiseId, travelDate } = req.query;
    //         if (!cruiseId || !travelDate) {
    //     return res.status(400).json({
    //       message: "cruiseId and travelDate are required"
    //     });
    //   }

    //   const result = await bookingService.getCruiseDateStatus({
    //     cruiseId,
    //     travelDate
    //   });

    //         return res.status(200).json(result);


    //     }
    //     catch(e){
    //         return res.status(500).json({
    //     message: e.message
    //   });
    //     }
    // }

    async getCruiseDateStatus(req,res){
    try{
        const { cruiseId, travelDate } = req.query;

        if (!travelDate) {
            return res.status(400).json({
                message: "travelDate is required"
            });
        }

        const result = await bookingService.getCruiseDateStatus({
            cruiseId,
            travelDate
        });

        return res.status(200).json(result);

    }
    catch(e){
        return res.status(500).json({
            message: e.message
        });
    }
}
}

export default new BookingController();