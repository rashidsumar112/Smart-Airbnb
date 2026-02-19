import Listing from "../model/listModel.js"
import Booking from "../model/BookModel.js"
import User from "../model/userModel.js"

export const createBooking=async(req,res)=>{
    try{
        let {id}=req.params
        let {checkIn,checkOut,totalRent}=req.body

        let listing= await Listing.findById(id)
        if(!listing){
            return res.status(404).json({message:"Listing is not found"})
        }

      //change
      let existingBooking = await Booking.findOne({ listing: id, guest: req.userId })
    if (existingBooking) {
      return res.status(400).json({ message: "You have already booked this listing" })
    }
    //change above



        if(new Date(checkIn) >= new Date(checkOut)){
            return res.status(400).json({message:"Invalid checkIn/checkOut date"})
        } 
        if(listing.isBooked){
            return res.status(400).json({message:"Listing is already Booked"})
        }
        let booking=await Booking.create({
            checkIn,
            checkOut,
            totalRent,
            host:listing.host,
            guest:req.userId,
            listing:listing._id

        })

        await booking.populate( "host" , "email" )

        let user=await User.findByIdAndUpdate(req.userId,{
            $push:{booking:booking._id}
        },{new:true})
         if(!user){
            return res.status(404).json({message:"User is not found"})

    }

    listing.guest=req.userId
    listing.isBooked=true
    await listing.save()
    return res.status(201).json(booking)
}
catch(error){
     return res.status(201).json({message:"booking error"})
     console.log(error)


}
}







//🔧 FIXED: for booking cancle - NOW PROPERLY DELETES BOOKING FROM ALL COLLECTIONS
// ⭐ NEW: Both HOST and GUEST can cancel the booking
export const cancleBooking = async(req,res)=>{
  try{
   // 📌 req.params.id is the LISTING ID (from frontend Card component)
   let {id}=req.params

   // 1️⃣ FIND THE BOOKING DOCUMENT using listing ID
   // This is crucial because we need the booking._id to remove it from users and Booking collection
   let booking = await Booking.findOne({listing:id})
   
   if(!booking){
    return res.status(404).json({message:"Booking not found"})
   }

   // ⭐ NEW: AUTHORIZATION CHECK - Only host or guest can cancel
   // This prevents unauthorized users from cancelling other people's bookings
   if(booking.host.toString() !== req.userId && booking.guest.toString() !== req.userId){
    return res.status(403).json({message:"You are not authorized to cancel this booking"})
   }

   // 2️⃣ UPDATE LISTING - set isBooked to false and clear guest reference
   let listing = await Listing.findByIdAndUpdate(
     id,
     {isBooked:false, guest:null},
     {new:true}
   )

   // 3️⃣ REMOVE BOOKING ID FROM HOST USER - ✅ NOW USING CORRECT booking._id
   await User.findByIdAndUpdate(
     booking.host,
     {$pull:{booking:booking._id}},  // ✅ FIXED: Use booking._id NOT listing._id
     {new:true}
   )

   // 4️⃣ REMOVE BOOKING ID FROM GUEST USER - ⭐ THIS WAS MISSING! 
   await User.findByIdAndUpdate(
     booking.guest,
     {$pull:{booking:booking._id}},  // ⭐ Essential: Guest user must also have booking removed
     {new:true}
   )

   // 5️⃣ DELETE THE BOOKING DOCUMENT FROM BOOKING COLLECTION - ⭐ THIS WAS MISSING!
   // This ensures the booking record is completely removed from DB
   await Booking.findByIdAndDelete(booking._id)

   if(!listing){
    return res.status(400).json({message:"Listing not found"})
   }
   
   return res.status(200).json({message:"Booking Cancelled Successfully and removed from all collections"})

  }

  catch(error){
     console.error("Cancel booking error:", error)
     return res.status(500).json({message:"Error In Booking Cancelling"})
  }
}






//for booking cancle
// export const cancleBooking = async(req,res)=>{
//   try{
//    let {id}=req.params
//    let listing= await Listing.findByIdAndUpdate(id,{isBooked:false})
//    let user =await User.findByIdAndUpdate(listing.host,{$pull:{booking:listing._id}},{new:true})

//    if(!user){
//     return res.status(400).json({message:"User is Not found"})
//    }
//    return res.status(200).json({message:"Booking Cancled"})

//   }

//   catch(error){
//      return res.status(500).json({message:"Error In Booking Cancling"})


//   }
// }






