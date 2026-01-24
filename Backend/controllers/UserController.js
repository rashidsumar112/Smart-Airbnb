//importing user model
import User from "../model/userModel.js";



//Controller function to get current authenticated user details
export const getCurrentUser= async(req,res)=>{
 try{
    //get user id from req object set by AuthUser middleware
    //fetch user details from db excluding password field
  let user= await User.findById(req.userId).select("-password");
  //If user not found
  if(!user){
    return  res.status(404).json({message:"User not found"});
  }
    res.status(200).json(user);





 }catch(error){
    //handle errors
    res.status(500).json({message:`Error in fetching current user: ${error.message}`})
 }


} 