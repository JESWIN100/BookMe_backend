import Joi from 'joi';

// Define Joi schema for validation
 export const adminSchema = Joi.object({
    adminName: Joi.string(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});