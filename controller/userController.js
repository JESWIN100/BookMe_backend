
import bcrypt  from 'bcrypt'
import { generateUserToken } from "../utils/generateToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateUserLogin, validateUserRegistration } from "../validation/userJoiValidation.js";
import { User } from '../model/userMode;.js';
import { cloudinaryInstance } from '../config/cloudinaryConfig.js';

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
    const hashedPassword = bcrypt.hashSync(password, salt);




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







export const userLogin=asyncHandler(async(req,res,next)=>{
  

    // Validate user input
    const { error } = validateUserLogin(req.body);
    if (error) {
        return res.status(402).json({ success: false, message: error.details[0].message });
    }
 
        const {email,password}=req.body;
        

        const userExit=await User.findOne({email})
        if(!userExit){
            return res.status(400).json({success: false,message:'user does not exist'})
            }

            const passwordMatch=bcrypt.compareSync(password,userExit.password)
            if(!passwordMatch){
                return res.status(400).json({success: false,message:'password is incorrect'})   
                }





 const token=generateUserToken(email)
 const cookieOptions = {
    sameSite: 'None',
    secure: true,
    httpOnly: true,
};
 res.cookie('token',token,{sameSite:"None",secure:true})
  res.json({success:true,message:'user logged in successfully'})


    } )


    export const userProfile=asyncHandler(async(req,res,next)=>{
  

        const user=req.user
        const userData=await User.findOne({email:user.email}).select("-password")

        
      res.json({success:true,message:'user data fetched',data:userData})
    
    
        } )

    

        export const userLogout=asyncHandler(async(req,res,next)=>{

            res.clearCookie("token")
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