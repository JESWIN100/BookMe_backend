import { asyncHandler } from "../utils/asyncHandler.js";


const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000); 
};

export const otpDetails = asyncHandler(async (req, res, next) => {
  
    const otp = generateOTP(); 
    
   
    res.json({
        success: true,
        message: "Otp created successfully",
        otp: otp, 
    });
});
