import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
    },
    busDetails: { // Adjusting to store bus-related information
        model: {
            type: String, // Assuming this is a string representing the bus model
            required: true, // Adjust based on your requirements
        },
        seats: {
            type: [Number], // Assuming the number of seats is a number
            required: true,
        },
        totalPrice: {
            type: Number, // Total price of the booking
            required: true,
        },
        busName: {
            type: String, // Name of the bus
            required: true,
        },
        from: {
            type: String, // Starting point for the bus
            required: true,
        },
        to: {
            type: String, // Destination for the bus
            required: true,
        },
        typeofBus: {
            type: String, // Type of the bus (e.g., luxury, standard, etc.)
            required: true,
        },
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: String,
        default: 'pending', // payment status can be 'pending', 'paid', 'failed'
    },
    confirmedAt: { // Added field to track payment confirmation date
        type: Date,
    },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});

// Exporting the Payment model
export const Payment = mongoose.model("Payment", paymentSchema);
