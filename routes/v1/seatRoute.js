;
import express from 'express'
import { cancelBookingStatus, confirmBookingStatus, getAllSeats, getUserSeatSelection, getWishlistById, userseatSelect } from '../../controller/seatController.js';
import { authUser } from '../../middleware/userAuth.js';


const router = express.Router();

// Route to handle seat selection and booking

router.post('/addWhislist',authUser ,userseatSelect);
router.get('/getwishlist/:BusId',authUser, getWishlistById);
router.post('/confirm/:bookingId', confirmBookingStatus);
router.get('/getall', getAllSeats);
router.post('/cancel/:bookingId', cancelBookingStatus);
router.get('/user/seat-selection',authUser, getUserSeatSelection);
export default router;
