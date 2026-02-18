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



//cancle booking
const cancleBooking = async (id) =>{
  try{

    let result= await axios.delete( serverURL + `/api/booking/cancle/${id}`,
     {withCredentials:true})
    

   await getCurrentUser()
   await getListing()

 console.log(result.data)
  toast.success("booking Canceled SuccesFully")

  }
  catch(error){
    console.log("Error",error)
     toast.error(error.response.data.message)

  }
}







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