import express from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { updateUser, userCreate, userLogin, userLogout, userProfile, verifyOTP } from '../../controller/userController.js';
import { authUser } from '../../middleware/userAuth.js';
import { upload } from '../../middleware/uploadMiddleWare.js';

const router = express.Router();



router.post('/create', upload.single('image'), asyncHandler(userCreate));
router.post('/login',userLogin);
router.post('/verify-otp', verifyOTP);
router.get('/profile', asyncHandler(authUser), userProfile);
router.put('/updateUser/:id',upload.single('image'),authUser, asyncHandler(updateUser));
router.post("/logout",authUser,asyncHandler,(userLogout))

export default router;
