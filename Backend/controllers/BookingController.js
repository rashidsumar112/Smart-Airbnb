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






//for booking cancle
export const cancleBooking = async(req,res)=>{
  try{
   let {id}=req.params
   let listing= await Listing.findByIdAndUpdate(id,{isBooked:false})
   let user =await User.findByIdAndUpdate(listing.host,{$pull:{booking:listing._id}},{new:true})

   if(!user){
    return res.status(400).json({message:"User is Not found"})
   }
   return res.status(200).json({message:"Booking Cancled"})

  }

  catch(error){
     return res.status(500).json({message:"Error In Booking Cancling"})


  }
}






// //my change
// export const cancleBooking = async (req, res) => {
//   try {
//     const { id } = req.params; // booking _id

//     // 1️⃣ Find the booking
//     const booking = await Booking.findById(id);
//     if (!booking) return res.status(404).json({ message: "Booking not found" });

//     // 2️⃣ Only host or guest can cancel
//     if (booking.host.toString() !== req.userId && booking.guest.toString() !== req.userId) {
//       return res.status(403).json({ message: "You cannot cancel this booking" });
//     }

//     // 3️⃣ Update listing
//     await Listing.findByIdAndUpdate(booking.listing, {
//       isBooked: false,
//       guest: null
//     });

//     // 4️⃣ Remove booking from host and guest
//     await User.findByIdAndUpdate(booking.host, { $pull: { booking: booking._id } });
//     await User.findByIdAndUpdate(booking.guest, { $pull: { booking: booking._id } });

//     // 5️⃣ Delete booking
//     await Booking.findByIdAndDelete(id);

//     return res.status(200).json({ message: "Booking cancelled successfully" });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Cancel booking failed" });
//   }
// };

