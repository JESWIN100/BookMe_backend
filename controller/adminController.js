import bcrypt  from 'bcryptjs'
import { Admin } from "../model/adminModel.js";
import { Bus } from "../model/busModel.js";
import { Passenger } from "../model/passengerModel.js";
import { Payment } from "../model/paymentSChema.js";
import { Seat } from "../model/seatModel.js";
import { User } from "../model/userMode;.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAdminToken } from "../utils/generateToken.js";
import { generatePNR } from "./pnrController.js";
import { adminSchema } from '../validation/adminJoiValidation.js';


export const AdminCreate = asyncHandler(async (req, res, next) => {
   
    // Validate the request body using Joi
    const { error } = adminSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }
   
    const { adminName, email, password } = req.body;

    const adminExist = await Admin.findOne({ email });
    if (adminExist) {
        return res.status(400).json({ success: false, message: "Admin already exists" });
    }


    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const newAdmin = new Admin({ adminName, email, password: hashedPassword });
    await newAdmin.save();

    const adminToken = generateAdminToken(email, "admin");

    // Set token in cookie
    res.cookie("Admintoken", adminToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    res.json({ success: true, message: "Admin created successfully" });
} )





export const adminLogin = asyncHandler(async (req, res, next) => {

    // Validate the request body using Joi
    const { error } = adminSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }
    
    const { email, password } = req.body;

    const adminExist = await Admin.findOne({ email });

    if (!adminExist) {
        return res.status(404).json({ success: false, message: "Admin does not exist" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, adminExist.password);
    if (!isMatch) {
        return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Create token
    const token = generateAdminToken(email, "admin");

    // Set token in cookie
    res.cookie("Admintoken", token, {sameSite:"None",secure:true});
    res.json({ success: true, message: "Admin login successfully" });
} )


export const adminProfile=asyncHandler(async(req,res,next)=>{


const {id}=req.params
const userData=await Admin.findById(id).select("-password")


res.json({success:true,message:'admin data fetched',data:userData})


} )


export const checkAdmin=asyncHandler(async(req,res,next)=>{


    const admin=req.admin;
    if(!admin){
        return res.status(401).json({success:false,message:'admin not authenticated'})
        }
    
  res.json({success:true,message:'admin is authenticated'})


} )


export const AdminLogout=asyncHandler(async(req,res,next)=>{

res.clearCookie("Admintoken")
res.json({success:true,message:'Admin logged out successfully'})


} )














////////////////////////////////////////////////////////////////////////////////
// Get all users
export const getAllUsers = asyncHandler(async (req, res, next) => {
    // Fetch all users from the database
    const users = await User.find();

    // If no users found, respond with a message
    if (!users) {
        return res.status(404).json({ success: false, message: "No users found" });
    }

    // Respond with success and the list of users
    res.json({ success: true, data: users });
});


////////////////////////////////////////////////////////////////////////////////////

export const busCreate = asyncHandler(async (req, res, next) => {
    // Extract bus details from request body
    const { busNumber, busName,duration, seatsAvailable, departureTime, arrivalTime,bus,day, StartsPrice,dropoffDate, typeofBus, route,date,dropoffLocation,pickupLocation,isAvailable } = req.body;


    const pnrNumber = generatePNR();
    const formattedDate = new Date(date).toISOString().split('T')[0];
    // Create new bus entry
    const newBus = new Bus({
        busNumber,
        busName,
        seatsAvailable,
        departureTime,
        arrivalTime,
        StartsPrice,
        typeofBus,
        day,
        route,
        bus,
        dropoffDate:formattedDate,
        date:formattedDate,
        dropoffLocation,
        pickupLocation,
        duration,
        isAvailable,
        pnr: pnrNumber 
    });

    // Save bus to database
    await newBus.save();

    // Respond with success
    res.json({ success: true, message: "Bus details created successfully", data: newBus });
});



export const getAllBuses = async (req, res) => {
    try {
  
      const product = await Bus.find();
      res.status(200).json(product);
  
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  

  ///////////////////////////////////////////////////////////////////////////////

  export const getAllPassengers = asyncHandler(async (req, res) => {
    try {
        // Fetch all passengers from the database
        const passengers = await Passenger.find();

        // If no passengers found, respond with appropriate message
        if (!passengers || passengers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No passengers found',
            });
        }

        // Respond with the list of passengers
        res.status(200).json({
            success: true,
            data: passengers,
        });
    } catch (error) {
        // Handle potential errors
        res.status(500).json({
            success: false,
            message: 'Server error, could not fetch passengers',
        });
    }
});


/////////////////////////////////////////////////////////////////////////////

export const getAllPayments = asyncHandler(async (req, res, next) => {
    try {
        // Retrieve all payment documents from MongoDB
        const payments = await Payment.find();

        // Check if there are any payments
        if (payments.length === 0) {
            return res.status(404).json({ success: false, message: 'No payments found' });
        }

        // Respond with all payment details
        res.status(200).json({ success: true, data: payments });
    } catch (error) {
        // Pass any unexpected errors to error-handling middleware
        next(error);
    }
});


////////////////////////////////////////////////////////////////////////

export const getAllSeats = asyncHandler(async (req, res, next) => {
  

 
    const wishlist = await Seat.find()
        .populate('user') 
        .populate('bus'); 
  
  
  
  
    if (!wishlist || wishlist.length === 0) {
        return res.status(404).json({ success: false, message: 'Seats not found.' });
    }
  
    res.json({ success: true, message: 'Seats retrieved successfully.', data: wishlist,});
  });