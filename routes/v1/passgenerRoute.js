// import { selectSeatAndProceed } from "../../controller/seatController.js";
import express from 'express'
import { authUser } from "../../middleware/userAuth.js";
import {  getPassengerByID, getPassengerByPNR, getPassengerDelete, getPassengerDetailsByUserId, passsengerDetails } from '../../controller/passengerController.js';


const router = express.Router();



router.post('/add',authUser ,passsengerDetails);
router.get('/getById/:id',authUser ,getPassengerByID);
router.get('/passengers/:pnr',authUser, getPassengerByPNR);
router.delete('/delete/:id',authUser, getPassengerDelete);
router.get('/pass/:userId', getPassengerDetailsByUserId);
export default router;
