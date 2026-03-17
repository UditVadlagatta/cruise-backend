import Joi from 'joi';

export const registerJoi=Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    role: Joi.string().required(),
    password: Joi.string().min(6).required()
}).unknown(false);

export const loginJoi= Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
}).unknown(false);