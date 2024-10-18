import { Bus } from "../model/busModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generatePNR } from "./pnrController.js";

export const bookCreate = asyncHandler(async (req, res, next) => {
    // Extract bus details from request body
    const { busNumber, busName,duration, seatsAvailable, departureTime,pickupStages,dropoffStages, arrivalTime,bus,day, StartsPrice,dropoffDate, typeofBus, route,date,dropoffLocation,pickupLocation,isAvailable } = req.body;


    const pnrNumber = generatePNR();
    const pickupdate = new Date(date).toISOString().split('T')[0];
    console.log(pickupdate);
    
    const dropoffdate = new Date(dropoffDate).toISOString().split('T')[0];
    console.log(dropoffdate);

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
        dropoffDate:dropoffdate,
        date:pickupdate,
        dropoffLocation,
        pickupLocation,
        duration,
        pickupStages: pickupStages ,
        dropoffStages: dropoffStages ,
        isAvailable,
        pnr: pnrNumber 
    });

    // Save bus to database
    await newBus.save();

    // Respond with success
    res.json({ success: true, message: "Bus details created successfully", data: newBus });
});




// Search bus by date, pickup, and dropoff location
export const searchBooking = asyncHandler(async (req, res, next) => {
    const { pickupLocation, dropoffLocation, date } = req.query;
  
    try {
      const buses = await Bus.find({
        pickupLocation: pickupLocation,
        dropoffLocation: dropoffLocation,
        date
      });
  
      if (buses.length === 0) {
        return res.status(404).json({ message: 'No buses found' });
      }
  
      res.json(buses);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
    }
})





//get all
export const getAllBuses = async (req, res) => {
  try {

    const product = await Bus.find();
    res.status(200).json(product);

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


// get by id 

export const getABuseById = async (req, res) => {
  try {

    const {id}=req.params
    const product = await Bus.findById(id);
    res.status(200).json(product);

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}



//pnr get 
export const getBusByPNR = asyncHandler(async (req, res) => {
  const { pnr } = req.params; // Extract PNR from the request URL

  // Find the bus entry by PNR
  const bus = await Bus.findOne({ pnr });

  if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found with the provided PNR" });
  }

  // Respond with the bus details
  res.json({ success: true, data: bus });
});