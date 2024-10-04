import express from 'express';
import { Createmessage } from '../../controller/nodeMailer.js';



const router = express.Router();

 
router.post("/create",Createmessage)




export default router;