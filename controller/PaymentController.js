// import Stripe from 'stripe';
// import { asyncHandler } from '../utils/asyncHandler.js';
// import { Payment } from '../model/paymentSChema.js';


// const stripe = new Stripe(process.env.Stripe_private_Api_Key);
      
// export const MakePayment = asyncHandler(async (req, res, next) => {
//     const { busName,total,seats,from, to, typeofBus } = req.body;

//     // Ensure required data is present
//     if (!busName || !total || !seats) {
//         return res.status(400).json({ success: false, message: 'Missing bus name, total price, or seats' });
//     }

//     // Prepare line item data for Stripe checkout
   
//     const lineItems = [
//         {
//             price_data: {
//                 currency: 'inr',
//                 product_data: {
//                     name: `${busName} (${typeofBus})`,
//                     description: `From: ${from} ➡️ To: ${to}\nSeats: ${seats.join(', ')}`,
//                 },
//                 unit_amount: Math.round(total * 100),
//             },
//             quantity: 1,
//         },
        
//     ];
    
        
    

//     try {
//         // Create a Stripe checkout session
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             line_items: lineItems,
//             mode: 'payment',
//             success_url: `${process.env.CLIENT_DOMAIN}/payment/scuess`, 
//             cancel_url: `${process.env.CLIENT_DOMAIN}/payment/failed`,
//         });

//         // Save payment details to MongoDB
//         const payment = new Payment({
//             sessionId: session.id,
//             busDetails: {
//                 model: busName,
//                 seats: seats[0],
//                 totalPrice: total,
//                 busName,
//                 total,
//                 seats,
//                 from,
//                  to,
//                 typeofBus,
//             },
//             totalAmount: total,
//             paymentStatus: 'pending',
//         });

//         await payment.save();

//         res.json({ success: true, sessionId: session.id });
//     } catch (error) {
//         next(error);
//     }
// });



// export const getAllPayments = asyncHandler(async (req, res, next) => {
//     try {
//         // Retrieve all payment documents from MongoDB
//         const payments = await Payment.find();

//         // Check if there are any payments
//         if (payments.length === 0) {
//             return res.status(404).json({ success: false, message: 'No payments found' });
//         }

//         // Respond with all payment details
//         res.status(200).json({ success: true, data: payments });
//     } catch (error) {
//         // Pass any unexpected errors to error-handling middleware
//         next(error);
//     }
// });


// export const getPaymentsByCarId = asyncHandler(async (req, res, next) => {
//     const { carId } = req.params;

//     try {
//         // Find all payments related to the given carId
//         const payments = await Payment.find({ 'carDetails.carId': carId });

//         if (payments.length === 0) {
//             return res.status(404).json({ success: false, message: 'No payments found for this car' });
//         }

//         // Respond with the payment data
//         res.status(200).json({ success: true, data: payments });
//     } catch (error) {
//         // Pass any unexpected errors to error-handling middleware
//         next(error);
//     }
// });


