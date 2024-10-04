import express from 'express';
import { AdminCreate, adminLogin, AdminLogout, adminProfile, busCreate, checkAdmin, getAllBuses, getAllPassengers, getAllPayments, getAllSeats, getAllUsers } from '../../controller/adminController.js';
import authAdmin from '../../middleware/adminAuth.js';


const router = express.Router();

router.post("/create",AdminCreate)
router.post("/login",adminLogin)
router.get("/check-admin",authAdmin,checkAdmin)
router.get("/adminById/:id",authAdmin,adminProfile)
router.post("/logout",authAdmin,AdminLogout)



////////////////////////////////////////////////////////////////////////
//user
router.get("/getallUser",getAllUsers)


////////////////////////////////////////
//bus
router.post("/addbus",authAdmin,busCreate)
router.get("/getallbuses",authAdmin,getAllBuses)

/////////////////////////////////
//passenger
router.get("/getallPassenger",authAdmin,getAllPassengers)

////////////////////////////////////////////
//payment

router.get("/getallpayment",authAdmin,getAllPayments)


//////////////////////////////////////////
//seat
router.get("/getallSeatsBooked",authAdmin,getAllSeats)




export default router;
