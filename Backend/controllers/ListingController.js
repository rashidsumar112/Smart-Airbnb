import uploadOnCloudinary from "../config/cloudinary.js";
import Listing from "../model/listModel.js";
import User from "../model/userModel.js";




export const addListing = async(req,res)=>{
   try{ 
    //host conatins userid which gives us by AuthUser.js
    let host =req.userId;
    let {title,description,rent,city,lanMark,category}=req.body;
    //it will takes images file from cloundinary
    let image1= await uploadOnCloudinary(res.files.image1[0],path)
    let image2= await uploadOnCloudinary(res.files.image2[0],path)
    let image3= await uploadOnCloudinary(res.files.image3[0],path)

//Here we craete listings
let listing=await Listing.create({
    title,
    description,
    rent,
    city,
    lanMark,
    category,
    image1,
    image2,
    image3,
    host
})

let user = await User.findByIdAndUpdate(host,{$push:{listing:listing._id}},{new:true})
if(!user){
    res.status(404).json({message:"User Not found"})

}
res.status(201).json(listing)
//here we push the listings of that User in UserModel where we Ref:Listings 






}
catch (error){
 res.status(500).json({message:`Error in addListing ${error}`})
}
}