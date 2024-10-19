import bcrypt  from 'bcryptjs'
import { generateUserToken } from "../utils/generateToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateUserLogin, validateUserRegistration } from "../validation/userJoiValidation.js";
import { User } from '../model/userMode;.js';
import { cloudinaryInstance } from '../config/cloudinaryConfig.js';


import nodemailer from 'nodemailer';

export const userCreate = asyncHandler(async (req, res, next) => {
    // Validate input using Joi
    const { error } = await validateUserRegistration(req.body);
    if (error) {
        return res.status(402).json({ success: false, message: error.details[0].message });
    }

    const { name, email, password, phone,birth,gender,address } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash the password
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);





  // Default image URL
  let imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL_ZnOTpXSvhf1UaK7beHey2BX42U6solRA&s"; 

  // Check if an image was uploaded
  if (req.file) {
      const uploadResult = await cloudinaryInstance.uploader.upload(req.file.path, { folder: "Passenger" });
      if (uploadResult?.url) {
          imageUrl = uploadResult.url; 
      }
  }


    // Create new user
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        phone,
        birth,
        gender,
        address,
         image: imageUrl 
    });

    await newUser.save();

    // Generate token
    const token = generateUserToken(email);

    // Set cookie
    res.cookie('token', token);

    // Respond with success
    res.json({ success: true, message: "User created successfully" });
});




const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000); 
};

let otpStore = {}; // To store OTPs temporarily

export const userLogin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (!userExist) {
        return res.status(400).json({ success: false, message: 'User does not exist' });
    }

    const passwordMatch = bcrypt.compareSync(password, userExist.password);
    if (!passwordMatch) {
        return res.status(400).json({ success: false, message: 'Password is incorrect' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    // Store OTP and expiry in user document
    userExist.otp = otp;
    userExist.otpExpiry = otpExpiry;
    await userExist.save(); // Save the user document

    // Send OTP to user's email
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code for BookMe',
        html: `
            <div style="background-color: #ffffff; padding: 32px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); width: 100%; max-width: 400px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <div style="display: flex; align-items: center;">
                        <span style="font-size: 24px; font-weight: bold; color: #4a5568;">BookMe</span>
                    </div>
                    <div style="display: flex;">
                        <a style="color: #a0aec0; margin-left: 16px;" href="#"><i class="fab fa-linkedin"></i></a>
                        <a style="color: #a0aec0; margin-left: 16px;" href="#"><i class="fab fa-twitter"></i></a>
                        <a style="color: #a0aec0; margin-left: 16px;" href="#"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
                <h2 style="font-size: 20px; font-weight: 600; color: #4a5568; margin-bottom: 16px;">Verify Your OTP Code</h2>
                <p style="color: #4a5568; margin-bottom: 16px;">Hello ${userExist.name || 'User'},</p>
                <p style="color: #4a5568; margin-bottom: 16px;">To complete your bus booking, please enter the following OTP code:</p>
                <div style="background-color: #edf2f7; border-radius: 8px; text-align: center;">
                    <span style="font-size: 36px; font-weight: bold; color: #805ad5;">${otp}</span>
                </div>
                <p style="color: #4a5568; margin-bottom: 16px;">This verification code is valid for the next 10 minutes.</p>
                <p style="color: #4a5568; margin-bottom: 16px;">If you didn’t request a booking, please ignore this message.</p>
                <div style="text-align: center; margin-top: 24px; color: #a0aec0;">
                    <p>Need assistance? Contact us at <a style="color: #805ad5;" href="mailto:support@bookme.com">support@bookme.com</a>.</p>
                    <p>BookMe © 2024</p>
                </div>
            </div>
        `,
    };
    
    

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'Error sending OTP' });
        }
        return res.json({ success: true, message: 'OTP sent to email' });
    });
});






export const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ success: false, message: 'User does not exist' });
    }

    // Check if OTP is correct and not expired
    if (user.otp !== otp || Date.now() > user.otpExpiry) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // OTP is valid, generate JWT token
    const token = generateUserToken(email, user._id);

    // Clear the OTP after successful login
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Set token in cookies and return success response
    res.cookie('token', token, { sameSite: 'None', secure: true, httpOnly: true });
    res.json({ success: true, message: 'User logged in successfully', token });
});





    
    export const userProfile=asyncHandler(async(req,res,next)=>{
  

        const user=req.user
        const userData=await User.findOne({email:user.email}).select("-password")

        
      res.json({success:true,message:'user data fetched',data:userData})
    
    
        } )

    

        export const userLogout=asyncHandler(async(req,res,next)=>{

            res.cookie("token");
              
             res.json({success:true,message:'user logged out successfully'})
             
        
            } )




        
            export const updateUser = asyncHandler(async (req, res, next) => {
                const { id } = req.params;
            
                // Handle image update if a new file is provided
                let updatedData = { ...req.body };
                if (req.file) {
                    const uploadResult = await cloudinaryInstance.uploader.upload(req.file.path, { folder: "Passenger" });
                    if (uploadResult?.url) {
                        updatedData.image = uploadResult.url;
                    }
                }
            
                const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
            
                if (!updatedUser) {
                    return res.status(404).json({ success: false, message: "User not found" });
                }
            
                res.json({ success: true, message: 'User updated successfully!', data: updatedUser });
            });