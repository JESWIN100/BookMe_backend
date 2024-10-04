import express from 'express';
import { authUser } from '../../middleware/userAuth.js';
import { bookCreate, getABuseById, getAllBuses, getBusByPNR, searchBooking } from '../../controller/busDetailsController.js';

const router = express.Router();



router.post('/bookDetails', authUser,(bookCreate));
router.get('/search',(searchBooking));
router.get('/busGet', authUser,(getAllBuses))
router.get('/busById/:id', authUser,(getABuseById))
router.get('/busBy/:pnr', authUser,(getBusByPNR))

export default router;
