import mongoose from 'mongoose';


const GENDER_ENUM = ['Male', 'Female', 'Other']; // Enum for gender

const passengerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [1, 'Age must be at least 1'],
    max: [120, 'Age cannot exceed 120']
  },
  gender: {
    type: String,
    enum: GENDER_ENUM,
    required: [true, 'Gender is required']
  },
  residency: {
    type: String,
    required: [true, 'Residency is required'],
    trim: true,
    minlength: [2, 'Residency must be at least 2 characters long'],
    maxlength: [100, 'Residency cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    // validate: {
    //   validator: validator.isEmail,
      // message: 'Please provide a valid email'
    // }
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    
  },
  pnr: {
    type: String,
    unique: true,
    required: true
  },
  seats:{
    type: [Number],
    required: [true, 'Seat number is required'],
  },
  totalPrice:{
    type:Number,
    required:[true,'Total price is required'],
    min: [0, 'Total price must be at least 0'],
    max: [100000, 'Total price cannot exceed 100000']

  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  bus: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Bus', 
    required: true 
  },
  
  
}, { timestamps: true });

export const Passenger = mongoose.model('Passenger', passengerSchema);
