import express from 'express';
import { CheckStatus, MakeAmount } from '../../controller/phonePay.js';

const router = express.Router();
                          

 router.post("/create", MakeAmount);
 router.get('/status', CheckStatus);


export default router;
