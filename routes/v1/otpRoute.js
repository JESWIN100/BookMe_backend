import express from 'express';
import { otpDetails } from '../../controller/optCreateController.js';

const router = express.Router();


router.post('/generate-otp', otpDetails);

export default router;
