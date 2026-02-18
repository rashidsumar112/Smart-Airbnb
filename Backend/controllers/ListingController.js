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
  return  res.status(404).json({message:"User Not found"})

}
return res.status(201).json(listing)
//here we push the listings of that User in UserModel where we Ref:Listings 






}
catch (error){
 console.log("FULL ERROR OBJECT:", error);
 return res.status(500).json({message:`Error in addListing ${error.message}`})
}
}



//here we gets the listing for home pages
export const getList= async (req,res)=>{
    try{
    let listing = await Listing.find().sort({createdAt:-1})
   return res.status(200).json(listing)
    }
    catch(error){
       return res.status(500).json({Message:`GetList Error${error}`})

    }
}


//for Find listing
export const findListing=async(req,res)=>{


    try{
        let {id} = req.params
        let listing=await Listing.findById(id)
        if(!listing){
          return  res.status(400).json({message:"Listing Not Find"})

        }
        return res.status(200).json(listing)

    }
    catch(error){

       return res.status(500).json({message:"Error in Find Listing"})
        console.log(error)

    }
}


//upaadte listing

// export const updateListing=async(req,res)=>{
//     try{
//         let image1;
//         let image2;
//         let image3;


//     console.log("USER ID:", req.userId);
//     console.log("BODY:", req.body);
//     console.log("FILES:", req.files);
//     //host conatins userid which gives us by AuthUser.js
//     let {id} =req.params;
//     let {title,description,rent,city,landmark,category}=req.body;
//     //it will takes images file from cloundinary


//     //my changes
//     console.log("Starting image uploads to Cloudinary...");
//     if(req.files.image1){
//      image1= await uploadOnCloudinary(req.files.image1[0].path)
//     console.log("Image 1 uploaded:", image1);}
//      if(req.files.image2){
//     image2= await uploadOnCloudinary(req.files.image2[0].path)
//     console.log("Image 2 uploaded:", image2);}
//      if(req.files.image3){
//     image3= await uploadOnCloudinary(req.files.image3[0].path)
//     console.log("Image 3 uploaded:", image3);}

//     // Check if all images were uploaded successfully
//     if (!image1 || !image2 || !image3) {
//       console.log("Image upload failed. image1:", image1, "image2:", image2, "image3:", image3);
//       return res.status(400).json({ message: "Failed to upload one or more images to Cloudinary" });
//     }

// //Here we create listings
// let listing=await Listing.findByIdAndUpdate(id,{
//     title,
//     description,
//     rent,
//     city,
//     landmark,
//     category,
//     image1,
//     image2,
//     image3,

// },{new:true})
//  return res.status(201).json(listing)

//     }
//     catch(error){
//         return res.status(500).json({message:"Update Error"})
//         console.log(error)

//     }
// }


// my change
export const updateListing = async (req, res) => {
  try {
    let image1;
    let image2;
    let image3;

    console.log("USER ID:", req.userId);
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    let { id } = req.params;
    let { title, description, rent, city, landmark } = req.body; // category removed

    // Upload only if new images are provided
    console.log("Starting image uploads to Cloudinary...");
    if (req.files?.image1) {
      image1 = await uploadOnCloudinary(req.files.image1[0].path);
      console.log("Image 1 uploaded:", image1);
    }
    if (req.files?.image2) {
      image2 = await uploadOnCloudinary(req.files.image2[0].path);
      console.log("Image 2 uploaded:", image2);
    }
    if (req.files?.image3) {
      image3 = await uploadOnCloudinary(req.files.image3[0].path);
      console.log("Image 3 uploaded:", image3);
    }

    // Find existing listing
    let listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Update text fields (without category)
    listing.title = title;
    listing.description = description;
    listing.rent = rent;
    listing.city = city;
    listing.landmark = landmark;

    // Update images only if new ones exist
    if (image1) listing.image1 = image1;
    if (image2) listing.image2 = image2;
    if (image3) listing.image3 = image3;

    await listing.save();

    return res.status(200).json(listing);
  } catch (error) {
    console.log("UPDATE ERROR:", error);
    return res.status(500).json({ message: "Update Error" });
  }
};







export const deleteListing=async(req,res)=>{
    try{
        let {id}=req.params
        let listing=await Listing.findByIdAndDelete(id)
        let user =await User.findByIdAndUpdate(listing.host,{$pull:{listing:listing._id}},{new:true})
        if(!user){
            return res.status(404).json({message:"User is not Find"})
        }
        return res.status(201).json({message:"Listing Deleted"})

    }
    catch(error){
      return res.status(500).json({message:`Error in Deleting Listing ${error}`})  

    }
}



//for ratings
export const ratingListing=async(req,res)=>{
    try{

    
    let {id}=req.params;
    let {ratings}=req.body;
    let listing=await Listing.findById(id)
    if(!listing){
          return  res.status(400).json({message:"Listing Not Find"})

        }
        listing.ratings=Number(ratings)
        await listing.save();
        return res.status(200).json({ratings:listing.ratings})
    


    }
    catch(error){
       return res.status(500).json({message:`Ratings Error ${error}`})
    }

}

//for serach Functionlity
export const search=async(req,res)=>{
    try{
        const {query}=req.query;
        if(!query){
            return res.status(400).json({message:"search Query is Required"})
        }
        const listing = await Listing.find({
            $or:[
                {landmark:{$regex:query,$options:"i"}},
                {city:{$regex:query,$options:"i"}},
                {title:{$regex:query,$options:"i"}},

            ],
        });
        return res.status(200).json(listing)

    }
    catch(error){
        console.log("Search Error",error)
        res.status(500).json({message:"Internal server error "})

    }
}