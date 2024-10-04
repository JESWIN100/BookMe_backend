import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    birth:{
        type: Date,

    },
    address:{
        type:String,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'], 
        
    },
    
    image: {
        type: String, // Updated to an array of strings to support multiple image URLs
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL_ZnOTpXSvhf1UaK7beHey2BX42U6solRA&s",
    
      },
    isAdmin: {
        type: Boolean,
        default: false,
    }, 
}, {
    timestamps: true,
});

export const User = mongoose.model("User", userSchema);
