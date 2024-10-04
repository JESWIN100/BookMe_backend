import Joi from "joi";

// Validation schemas
 export const passengerDetailsSchema = Joi.object({
    name: Joi.string().required().min(3),
    gender: Joi.string().valid("Male", "Female", "Other").required(),
    age: Joi.number().integer().min(0).required(),
    residency: Joi.string().required().min(2),
    user:Joi.string(),
    bus:Joi.string(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(), 
    totalPrice:Joi.number(),
    seats:Joi.required()
});

export const passengerAnotherDetailSchema = Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(), // 10-digit phone number,
    user:Joi.string(),
    bus:Joi.string()
});