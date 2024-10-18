import { Passenger } from "../model/passengerModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { passengerAnotherDetailSchema, passengerDetailsSchema } from "../validation/passengerJoiValidation.js";
import { generatePNR } from "./pnrController.js";
import { Seat } from "../model/seatModel.js";
// Create passenger details
export const passsengerDetails = asyncHandler(async (req, res, next) => {
    
    const { error } = passengerDetailsSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const pnrNumber = generatePNR();
    const { name, gender, age, residency,bus,email, phone,totalPrice,seats,} = req.body;
    const user=req.user.userId; 

  //  const seatCheck=Passenger.findOne({})

    const newPassenger = new Passenger({ name, gender, age, residency,bus,user,email, phone,totalPrice,seats:seats,pnr: pnrNumber   });

    // Save passenger to database
    await newPassenger.save();

    // Respond with success
    res.json({ success: true, message: "Passenger details created successfully", data: newPassenger });
});


export const getPassengerByID = async (req, res) => {
    try {
  
      const {id}=req.params
      const product = await Passenger.findById(id).populate("user").populate("bus")
      res.status(200).json(product);
  
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  


export const  getPassengerByPNR = asyncHandler(async (req, res, next) => {
    const { pnr } = req.params;
    
    // Find passenger by PNR number
    const passenger = await Passenger.findOne({ pnr }).populate("user").populate("bus")

    if (!passenger) {
        return res.status(404).json({ success: false, message: 'Passenger not found with this PNR number' });
    }

    // Respond with passenger data
    res.json({ success: true, data: passenger });
});



export const getPassengerDelete = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete passenger by PNR
    const passenger = await Passenger.findOneAndDelete({ pnr:id });

    if (!passenger) {
      return res.status(404).json({ success: false, message: 'Passenger not found with this PNR number' });
    }

const seat=await Seat.findOneAndDelete(id)
// Respond with success

if (!seat) {
  return res.status(404).json({ success: false, message: 'seat not found ' });
}

    res.status(200).json({ success: true, message: 'Passenger deleted successfully', data: passenger });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getPassengerDetailsByUserId = asyncHandler(async (req, res, next) => {

  // const {userId} = req.params; 
  const userId=req.user.userId; 
  if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
  }

  // Find passengers by userId
  const passengers = await Passenger.find({ user: userId }).populate("user").populate("bus")

  // If no passengers are found, return a 404 status
  if (!passengers || passengers.length === 0) {
      return res.status(404).json({ success: false, message: "No passenger details found for this user" });
  }

  // Respond with the found passenger details
  res.json({ success: true, message: "Passenger details retrieved successfully", data: passengers });
});