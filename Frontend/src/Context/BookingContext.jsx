import axios from 'axios'
import React, { Children, createContext, useContext, useState } from 'react'
import AuthContext, { authDataContext } from './AuthContext'
import { userDataContext } from './UserContext'
import { listDataContext } from './ListContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
export const  BookingDataContext=createContext()

function BookingContext({children}) {
let navigate=useNavigate()

let [checkIn,setCheckIn]=useState("")
let [checkOut,setCheckOut]=useState("")
let [total,setTotal]=useState(0)
let [night,setNight]=useState(0)
let {serverURL} =useContext(authDataContext)
let {getCurrentUser}= useContext(userDataContext)
let {getListing}=useContext(listDataContext)
let {getlist}=useContext(listDataContext)
let [bookingData,setBookingData]=useState([])
let [booking,setBooking]=useState(false)









//booking creation
const handleBooking = async (id) => {

  setBooking(true)
  try{
   let result= await axios.post( serverURL + `/api/booking/create/${id}`,
    {
    checkIn,checkOut,totalRent:total
   },{withCredentials:true})

   await getCurrentUser()
   await getListing()
setBookingData(result.data)
 console.log(result.data)
 setBooking(false)
 navigate("/booked")
  toast.success("Booked Successfully")





  }

  catch(error){
    console.error("BOOKING ERROR:", error.message)
    console.log("already booked")
    setBookingData(null)
     toast.error(error.response.data.message)
    setBooking(false)

  }
}




//❌ CANCLE BOOKING - FIXED VERSION
// This function now properly removes the booking from ALL collections:
// 1. Deletes booking document from Booking collection
// 2. Removes booking._id from host user's booking array
// 3. Removes booking._id from guest user's booking array  
// 4. Sets listing.isBooked = false
const cancleBooking = async (id) =>{
  try{
    // 🔧 id is the LISTING ID passed from Card component
    // Backend will use this to find the booking and perform cleanup
    let result= await axios.delete( 
      serverURL + `/api/booking/cancle/${id}`,
      {withCredentials:true}
    )
    
    // ✅ Refresh user data to reflect changes in the UI
    // This updates the user's booking array (removes the cancelled booking)
    await getCurrentUser()
    
    // ✅ Refresh listings to show isBooked = false
    // This updates all listings to reflect that they're no longer booked
    await getListing()

    console.log("✅ Booking cancelled successfully:", result.data)
    toast.success("Booking Canceled Successfully")

  }
  catch(error){
    console.error("❌ Error cancelling booking:", error)
    toast.error(error.response?.data?.message || "Failed to cancel booking")
  }
}











//cancle booking
// const cancleBooking = async (id) =>{
//   try{

//     let result= await axios.delete( serverURL + `/api/booking/cancle/${id}`,
//      {withCredentials:true})
    

//    await getCurrentUser()
//    await getListing()

//  console.log(result.data)
//   toast.success("booking Canceled SuccesFully")

//   }
//   catch(error){
//     console.log("Error",error)
//      toast.error(error.response.data.message)

//   }
// }







let value={
  checkIn,setCheckIn,
  checkOut,setCheckOut,
  total,setTotal,
  night,setNight,
  bookingData,setBookingData,
  handleBooking,cancleBooking,setBooking,booking


}

  return (

    <div>
   <BookingDataContext.Provider value={value}>
    {children}
   </BookingDataContext.Provider>

    </div>
  )
}

export default BookingContext