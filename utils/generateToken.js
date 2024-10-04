import jwt from 'jsonwebtoken'

export const generateUserToken=(email)=>{

    const token =jwt.sign({email:email,role:"user"},process.env.JWT_SECRET_KEY);
    return token;
}



export const generateAdminToken = (email, role) => {
    // Define payload
    const payload = {
        email,
        role
    };

    // Define token options
    // const options = {
    //     expiresIn: '2h' // Token expiration time
    // };

    // Generate token
    const Admintoken = jwt.sign(payload, process.env.JWT_SECRET_KEY);

    return Admintoken;
};

// Function to generate a review token
export const generateReviewToken = (reviewId) => {
    return jwt.sign({ reviewId }, process.env. JWT_SECRET_KEY, { expiresIn: '1h' });
};
