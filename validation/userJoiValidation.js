import Joi from 'joi';

// User registration validation schema
export const validateUserRegistration = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        phone: Joi.string().pattern(/^[0-9]{10}$/),
        gender:Joi.string(),
        address: Joi.string(),
        birth:Joi.date()
        
    });
    return schema.validate(data);
};

// User login validation schema
export const validateUserLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data);
};
 