import Joi from "joi";

const segmentSchema = Joi.object({
  from: Joi.string().trim().required(),
  to: Joi.string().trim().required(),
  time: Joi.number().min(1).required(),        // minutes
  distance: Joi.number().min(1).required(),    // meters
  note: Joi.string().trim().optional()
});


export const registerCruiseJoi = Joi.object({
    name: Joi.string().trim().min(3).max(100).required(),
    description: Joi.string().trim().min(5).required(),
    // destination: Joi.string().trim().required(),
    // departurePort: Joi.string().trim().required(),
    // duration: Joi.number().integer().min(1).required(),
    price: Joi.number().positive().required(),
    capacity: Joi.number().integer().min(1).required(),
    status: Joi.string().valid("ACTIVE", "INACTIVE").optional(),
    image: Joi.string().optional(),


    

  //   route: Joi.object({
  //   from: Joi.string().trim().required(),
  //   to: Joi.string().trim().required(),
  //   segments: Joi.array().items(segmentSchema).min(1).required(),
  //   totalTime: Joi.number().min(1).required(),
  //   totalDistance: Joi.number().min(1).required()
  // }).required(),
  route: Joi.object({
  from: Joi.string().trim().required(),
  to: Joi.string().trim().required(),
  segments: Joi.array().items(segmentSchema).min(1).required(),
  totalTime: Joi.number().min(1).optional(),
  totalDistance: Joi.number().min(1).optional()
}).required(),




}).unknown(false);