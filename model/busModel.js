import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
  busNumber: {
    type: String,
    required: true,
  },
  busName: {
    type: String,
    required: true
  },
  seatsAvailable: {
    type: Number,
    required: true
  },
  departureTime: {
    type: String,
    required: true
  },
  arrivalTime: {
    type: String,
    required: true
  },
  StartsPrice: {
    type: Number,
    required: true
  },
  typeofBus: {
    type: String, // e.g., AC, Non-AC, Sleeper, etc.
    required: true
  },
  route: {
    type: String,
    required: true
  },
  dropoffDate:{
    type: String, // Store as ISO format 'YYYY-MM-DD' string
    required: true
  },
  date: {
    type: String, // Store as ISO format 'YYYY-MM-DD' string
    required: true
  },
  pickupLocation: {
    type: String,
    required: true
  },
  dropoffLocation: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  bus:{
    type: String,
    required: true
  },
  isAvailable:{
    type:Boolean,
    default:true
  },
  day:{
    type:String,
    required:true
  },
  pnr: {
    type: String,
    unique: true,
    required: true
  },
  pickupStages:{
    type:[String],
    required:true
      },
  dropoffStages:{
type:[String],
required:true
  },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seat'
    }
  ]
}, { timestamps: true });

export const Bus = mongoose.model('Bus', busSchema);
