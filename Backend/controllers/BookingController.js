// import Listing from "../model/listModel.js"
// import Booking from "../model/BookModel.js"
// import User from "../model/userModel.js"

// export const createBooking=async(req,res)=>{
//     try{
//         let {id}=req.params
//         let {checkIn,checkOut,totalRent}=req.body

//         let listing= await Listing.findById(id)
//         if(!listing){
//             return res.status(404).json({message:"Listing is not found"})
//         }
//         if(new Date(checkIn)>= new Date(checkOut)){
//             return res.status(400).json({message:"Invalid checkIn/checkOut date"})
//         } 
//         if(listing.isBooked){
//             return res.status(400).json({message:"Listing is already Booked"})
//         }
//         let booking=await Booking.create({
//             checkIn,
//             checkOut,
//             totalRent,
//             host:listing.host,
//             guest:req.userId,
//             listing:listing._id

//         })

//         let user=await User.findByIdAndUpdate(req.userId,{
//             $push:{booking:booking._id}
//         },{new:true})
//          if(!user){
//             return res.status(404).json({message:"User is not found"})

//     }

//     listing.guest=req.userId
//     listing.isBooked=true
//     await listing.save()
//     return res.status(201).json(booking)
// }
// catch(error){
//      return res.status(201).json({message:"booking error"})
//      console.log(error)


// }
// }

import Listing from "../model/listModel.js"
import Booking from "../model/BookModel.js"
import User from "../model/userModel.js"

export const createBooking = async (req, res) => {
  try {
    const { id } = req.params
    const { checkIn, checkOut, totalRent } = req.body

    // 1️⃣ Find listing
    const listing = await Listing.findById(id)
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" })
    }

    // 2️⃣ Date validation
    if (new Date(checkIn) >= new Date(checkOut)) {
      return res.status(400).json({ message: "Invalid check-in or check-out date" })
    }

    // 3️⃣ Already booked check
    if (listing.isBooked) {
      return res.status(400).json({ message: "Listing already booked" })
    }

    // 4️⃣ Prevent duplicate booking by same user
    const existingBooking = await Booking.findOne({
      guest: req.userId,
      listing: listing._id
    })
    if (existingBooking) {
      return res.status(400).json({ message: "You already booked this listing" })
      
    }

    // 5️⃣ Create booking
    const booking = await Booking.create({
      checkIn,
      checkOut,
      totalRent,
      host: listing.host,
      guest: req.userId,
      listing: listing._id
    })

    // 6️⃣ Push BOOKING ID into user (FIXED)
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $push: { booking:booking._id } },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // 7️⃣ Update listing status
    listing.guest = req.userId
    listing.isBooked = true
    await listing.save()

    // 8️⃣ Success response
    return res.status(201).json({
      message: "Booking successful",
      booking
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Booking error" })
  }
}

//for booking cancle
export const cancleBooking = async(req,res)=>{
  try{
   let {id}=req.params
   let listing= await Listing.findByIdAndUpdate(id,{isBooked:false})
   let user =await User.findByIdAndUpdate(listing.guest,{$pull:{booking:listing._id}},{new:true})

   if(!user){
    return res.status(400).json({message:"User is Not found"})
   }
   return res.status(200).json({message:"Booking Cancled"})

  }

  catch(error){
     return res.status(500).json({message:"Error In Booking Cancling"})


  }
}

