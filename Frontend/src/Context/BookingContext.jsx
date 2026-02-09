import axios from 'axios'
import React, { Children, createContext, useContext, useState } from 'react'
import AuthContext, { authDataContext } from './AuthContext'
import { userDataContext } from './UserContext'
import { listDataContext } from './ListContext'
export const  BookingDataContext=createContext()

function BookingContext({children}) {
let [checkIn,setCheckIn]=useState("")
let [checkOut,setCheckOut]=useState("")
let [total,setTotal]=useState(0)
let [night,setNight]=useState(0)
let {serverURL} =useContext(authDataContext)
let {getCurrentUser}= useContext(userDataContext)
let {getListing}=useContext(listDataContext)
let {getlist}=useContext(listDataContext)
let [bookingData,setBookingData]=useState([])









//booking creation
const handleBooking = async (id) => {
  try{
   let result= await axios.post( serverURL + `/api/booking/create/${id}`,
    {
    checkIn,checkOut,totalRent:total
   },{withCredentials:true})

   await getCurrentUser()
   await getListing()
setBookingData(result.data)
 console.log(result.data)





  }

  catch(error){
    console.error("BOOKING ERROR:", error.message)
    console.log("already booked")
  
    setBookingData(null)

  }
}



//cancle booking
const cancleBooking = async(id)=>{
  try{

    let result= await axios.delete( serverURL + `/api/booking/cancle/${id}`,
     {withCredentials:true})

   await getCurrentUser()
   await getListing()

 console.log(result.data)

  }
  catch(error){
    console.log(error)

  }
}







let value={
  checkIn,setCheckIn,
  checkOut,setCheckOut,
  total,setTotal,
  night,setNight,
  bookingData,setBookingData,
  handleBooking,cancleBooking


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