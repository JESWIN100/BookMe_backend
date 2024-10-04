// paymentJoiSchema.js
import Joi from 'joi';

export const paymentSchema = Joi.object({
    booking: Joi.string().messages({
        'string.empty': 'Booking ID is required',
        'any.required': 'Booking ID is required'
    }),
    amount: Joi.number().positive().messages({
        'number.base': 'Amount must be a number',
        'number.positive': 'Amount must be a positive value',
        'any.required': 'Amount is required'
    }),
    paymentMethod: Joi.string().valid('Credit Card', 'Debit Card', 'Net Banking', 'UPI', 'Cash').messages({
        'string.empty': 'Payment method is required',
        'any.required': 'Payment method is required',
        'any.only': 'Payment method must be one of the following: Credit Card, Debit Card, Net Banking, UPI, Cash'
    }),
    transactionId: Joi.string().messages({
        'string.empty': 'Transaction ID is required',
        'any.required': 'Transaction ID is required'
    }),
    description: Joi.string().optional().allow('').messages({
        'string.base': 'Description must be a string'
    })
});
