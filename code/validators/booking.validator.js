import Joi from 'joi'

export const registerBookingJoi = Joi.object({
    customer: Joi.string()
        .required()
        .pattern(/^[0-9a-fA-F]{24}$/), // MongoDB ObjectId validation

    cruise: Joi.string()
        .required()
        .pattern(/^[0-9a-fA-F]{24}$/),
    
    travelDate: Joi.date()
        .required(),
        // .greater('now'),  // travel date must be in the future
    
    seatsBooked: Joi.number()
        .required()
        .min(1)
        .max(5),
    boardingPoint: Joi.string().required(),
    dropPoint: Joi.string().required()




    // optional: status, backend can default to PENDING
    // status: Joi.string()
    //     .valid('PENDING','CONFIRMED','CANCELLED')
    //     .optional(),

    // optional: totalPrice, backend can calculate
    // totalPrice: Joi.number()
    //     .min(0)
    //     .optional()
})


export const updateBookingJoi = Joi.object({
    travelDate: Joi.date()
        .iso(),

    seatsBooked: Joi.number()
        .integer()
        .min(1)
        .max(5),

    status: Joi.string()
        .valid("CONFIRMED", "CANCELLED", "PENDING"),
    boardingPoint: Joi.string().required(),
    dropPoint: Joi.string().required()



})
.min(1) // 🔥 At least one field required
.messages({
    "object.min": "At least one field must be updated"
})
.options({ abortEarly: false }); // show all errors