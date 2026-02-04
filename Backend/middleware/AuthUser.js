//Here we make Functionality to implement User Authentication Middleware
//This Middleware will be used to protect routes that require user to be authenticated
//like accessing user profile booking history etc

//this use for the getings Current user data
import jwt from "jsonwebtoken";




const AuthUser= async(req,res,next)=>{
try{
    //Check if user is authenticated
    let {token}= req.cookies;
    //If no token found return unauthorized error
    if(!token){
        return res.status(401).json({message:"Unauthorized: No token provided"})
    }
    //Verify the token here (implementation depends on the token strategy used, e.g., JWT)
    //If token is valid proceed to next middleware or route handler
    //If token is invalid return unauthorized error
    let verifyToken= await jwt.verify(token,process.env.JWT_SECRET);
    //If token verification fails
    if(!verifyToken){
        return res.status(401).json({message:"Unauthorized: Invalid token"})
    }
    //If token is valid attach user info to request object for further use
    req.userId=verifyToken.userId
    //Proceed to next middleware or route handler
    next();


}catch(error){
    res.status(500).json({message:`Authentication error: ${error.message}`})
}


}

export default AuthUser;