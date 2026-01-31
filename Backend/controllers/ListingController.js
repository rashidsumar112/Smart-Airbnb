import uploadOnCloudinary from "../config/cloudinary.js";
import Listing from "../model/listModel.js";
import User from "../model/userModel.js";




export const addListing = async(req,res)=>{
   try{ 

    console.log("USER ID:", req.userId);
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    //host conatins userid which gives us by AuthUser.js
    let host =req.userId;
    let {title,description,rent,city,landmark,category}=req.body;
    //it will takes images file from cloundinary


    //my changes
    console.log("Starting image uploads to Cloudinary...");
    let image1= await uploadOnCloudinary(req.files.image1[0].path)
    console.log("Image 1 uploaded:", image1);
    
    let image2= await uploadOnCloudinary(req.files.image2[0].path)
    console.log("Image 2 uploaded:", image2);
    
    let image3= await uploadOnCloudinary(req.files.image3[0].path)
    console.log("Image 3 uploaded:", image3);

    // Check if all images were uploaded successfully
    if (!image1 || !image2 || !image3) {
      console.log("Image upload failed. image1:", image1, "image2:", image2, "image3:", image3);
      return res.status(400).json({ message: "Failed to upload one or more images to Cloudinary" });
    }

//Here we create listings
let listing=await Listing.create({
    title,
    description,
    rent,
    city,
    landmark,
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
 console.log("FULL ERROR OBJECT:", error);
 res.status(500).json({message:`Error in addListing ${error.message}`})
}
}



//here we gets the listing for home pages
export const getList= async (req,res)=>{
    try{
    let listing = await Listing.find().sort({createdAt:-1})
    res.status(200).json(listing)
    }
    catch(error){
        res.status(500).json({Message:`GetList Error${error}`})

    }
}