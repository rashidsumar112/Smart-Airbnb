//importing user model
import User from "../model/userModel.js";
import Listing from "../model/listModel.js";





//Controller function to get current authenticated user details
export const getCurrentUser= async(req,res)=>{
 try{
    //get user id from req object set by AuthUser middleware
    //fetch user details from db excluding password field
  let user= await User.findById(req.userId).select("-password").populate("listing","title image1 image2 image3 description rent category city landmark isBooked host ratings").populate({
        path: "booking",
        populate: {
          path: "listing",
          model: "Listing",
          select:
            "title image1 image2 image3 description rent category city landmark isBooked host ratings"
        }
      })
  
  
  
  
  // .populate("booking","title image1 image2 image3 description rent category city landmark isBooked host ratings")
  //If user not found
  if(!user){
    return  res.status(404).json({message:"User not found"});
  }
   return res.status(200).json(user);





 }catch(error){
    //handle errors
   return res.status(500).json({message:`Error in fetching current user: ${error.message}`})
 }


} 