import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['available', 'booked', 'pending','confirmed','canceled'], 
    default: 'available', 
  },
  seatNumbers: { 
    type: [Number],
    required: true
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
});

export const Seat = mongoose.model('Seat', seatSchema);
