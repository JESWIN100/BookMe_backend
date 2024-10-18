import { Bus } from "../model/busModel.js";
import { Seat } from "../model/seatModel.js";
import { User } from "../model/userMode;.js";
import { asyncHandler } from "../utils/asyncHandler.js";





// export const userseatSelect = asyncHandler(async (req, res, next) => {
//   const { userId, busId, seatNumber } = req.body;

//   // Validate input
//   if (!userId || !busId || !seatNumber) {
//     return res.status(400).json({ success: false, message: "User ID, Bus ID, and Seat Number are required" });
//   }

//   // Check if user exists
//   const userExists = await User.findById(userId);
//   if (!userExists) {
//     return res.status(404).json({ success: false, message: "User not found" });
//   }

//   // Check if bus exists
//   const busExists = await Bus.findById(busId);
//   if (!busExists) {
//     return res.status(404).json({ success: false, message: "Bus not found" });
//   }

//   // Find or create a wishlist
//   let wishlist = await Seat.findOne({ user: userId });

//   if (!wishlist) {
//     wishlist = new Seat({ user: userId, buss: [] });
//   }

//   const seatEntry = { bus: busId, seatNumber: seatNumber };
//   const seatIndex = wishlist.buss.findIndex(seat => seat.bus === busId && seat.seatNumber === seatNumber);

//   if (seatIndex !== -1) {
//     // If seat exists, remove it
//     wishlist.buss.splice(seatIndex, 1);
//     res.status(200).json({ success: true, message: `Seat ${seatNumber} removed from Bus ${busId}`, data: wishlist });
//   } else {
//     // If seat doesn't exist, add it
//     wishlist.buss.push(seatEntry);
//     res.status(200).json({ success: true, message: `Seat ${seatNumber} booked successfully for Bus ${busId}`, data: wishlist });
//   }


  
//   await wishlist.save(); // Save 'wishlist' object
// });
///////////////////////////////

export const userseatSelect = asyncHandler(async (req, res, next) => {
  try {
    const { busId, seatNumbers } = req.body;
    const userId = req.user.userId; 
// console.log("gggggggggggggggggg",userId);

    // Validate inputs
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }
    if (!busId) {
      return res.status(400).json({ message: 'Bus ID is required.' });
    }
    if (!seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({ message: 'Seat numbers must be an array and contain at least one seat number.' });
    }

    
    const bookedSeats = await Seat.find({
      bus: busId,
      seatNumbers: { $in: seatNumbers },
      status: 'pending', 
    }).populate("user").populate("bus");

    if (bookedSeats.length > 0) {
      return res.status(409).json({
        message: `Some seats are already booked: ${bookedSeats.map(seat => seat.seatNumbers).join(', ')}`,
      });
    }

    // Create a new booking entry for the user with the seat numbers
    const booking = new Seat({
      user: userId,  // Use userId from the authenticated request
      bus: busId,
      seatNumbers, // Directly save the seatNumbers array
      status: 'pending', 
    });

    // Save the booking
    await booking.save();

    return res.status(200).json({ message: 'Seats booked successfully!', booking });
  } catch (error) {
    console.error("Error booking seats:", error);
    return res.status(500).json({ message: 'An error occurred while booking seats.' });
  }
});








export const deleteWishlistById = asyncHandler(async (req, res, next) => {

    const { userId } = req.params;

    // Find the wishlist for the user
    const wishlist = await Seat.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    // Delete the wishlist
    await Seat.deleteOne({ user: userId });

    res.json({ success: true, message: 'Wishlist deleted successfully' });
  } )


//   export const getWishlistById = asyncHandler(async (req, res, next) => {
//     const { BusId } = req.params;

//     // Find all booked seats for the user
//     const wishlist = await Seat.find({
//         bus: { $elemMatch: { bus: BusId } } // Correctly querying within the array
//     }).populate('user').populate('bus.bus');

//     if (!wishlist || wishlist.length === 0) {
//         return res.status(404).json({ success: false, message: 'Wishlist not found.' });
//     }

//     res.json({ success: true, message: 'Wishlist retrieved successfully.', data: wishlist });
// });

export const getWishlistById = asyncHandler(async (req, res, next) => {
  const { BusId } = req.params;
//  console.log("fdffd",BusId);
 
  // Find all booked seats for the specific bus
  const wishlist = await Seat.find({ bus: BusId }) // Corrected query syntax
      .populate('user') // Populate user details
      .populate('bus'); // Populate bus details




  if (!wishlist || wishlist.length === 0) {
      return res.status(404).json({ success: false, message: 'Seat not found.' });
  }

  res.json({ success: true, message: 'Seat retrieved successfully.', data: wishlist,});
});



export const getAllSeats = asyncHandler(async (req, res, next) => {
  

 
  const wishlist = await Seat.find()
      .populate('user') 
      .populate('bus'); 




  if (!wishlist || wishlist.length === 0) {
      return res.status(404).json({ success: false, message: 'Seats not found.' });
  }

  res.json({ success: true, message: 'Seats retrieved successfully.', data: wishlist,});
});








export const confirmBookingStatus = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  // Validate bookingId
  if (!bookingId) {
    return res.status(400).json({ message: 'Booking ID is required.' });
  }

  // Find the booking by ID
  const booking = await Seat.findById(bookingId);

  // If no booking found
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' });
  }

  // Check if the booking is already confirmed
  if (booking.status === 'confirmed') {
    return res.status(400).json({ message: 'Booking is already confirmed.' });
  }

  // Update the booking status to confirmed
  booking.status = 'confirmed';
  await booking.save();

  return res.status(200).json({ message: 'Booking confirmed successfully!', booking });
});



export const cancelBookingStatus = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;


  if (!bookingId) {
    return res.status(400).json({ message: 'Booking ID is required.' });
  }


  const booking = await Seat.findById(bookingId);


  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' });
  }

  if (booking.status === 'canceled') {
    return res.status(400).json({ message: 'Booking is already canceled.' });
  }

  booking.status = 'canceled';
  await booking.save();

  return res.status(200).json({ message: 'Booking canceled successfully!', booking });
});



export const getUserSeatSelection = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId 
// console.log("ggggggggggggggggggggggg",userId);

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  const userBookings = await Seat.find({ user: userId }).populate('user').populate('bus')

  if (!userBookings || userBookings.length === 0) {
    return res.status(404).json({ message: 'No bookings found!!' });
  }

  return res.status(200).json({ message: 'Seat bookings retrieved successfully!', bookings: userBookings });
});