import axios from 'axios'
import React, { Children, createContext, useContext, useState } from 'react'
import AuthContext, { authDataContext } from './AuthContext'
import { userDataContext } from './UserContext'
import { listDataContext } from './ListContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
export const BookingDataContext = createContext()

function BookingContext({ children }) {
  let navigate = useNavigate()
  let [checkIn, setCheckIn] = useState("")
  let [checkOut, setCheckOut] = useState("")
  let [total, setTotal] = useState(0)
  let [night, setNight] = useState(0)
  let [paymentMethod, setPaymentMethod] = useState("stripe")
  let { serverURL } = useContext(authDataContext)
  let { getCurrentUser } = useContext(userDataContext)
  let { getListing } = useContext(listDataContext)
  let { getlist } = useContext(listDataContext)
  let [bookingData, setBookingData] = useState(null)
  let [booking, setBooking] = useState(false)









  //booking creation
  const handleBooking = async (id) => {

    setBooking(true)
    try {
      let result = await axios.post(serverURL + `/api/booking/create/${id}`,
        {
          checkIn, checkOut, totalRent: total, paymentMethod
        }, { withCredentials: true })

      await getCurrentUser()
      await getListing()
      setBookingData(null)
      console.log(result.data)
      setBooking(false)

      // 🧹 CLEAR BOOKING FORM DATA AFTER SUCCESSFUL CHECKOUT SESSION CREATION
      setCheckIn("")
      setCheckOut("")
      setTotal(0)
      setNight(0)
      setPaymentMethod("stripe")

      if (result.data?.paymentMethod === "cash" && result.data?.booking) {
        setBookingData(result.data.booking)
        localStorage.setItem('latestBooking', JSON.stringify(result.data.booking))
        toast.success("Booking confirmed successfully")
        setBooking(false)
        navigate("/booked")
        return
      }

      if (result.data?.session_url) {
        toast.success("Redirecting to Stripe payment...")
        window.location.replace(result.data.session_url)
      } else {
        toast.error("Payment session was not created")
      }
    }

    catch (error) {
      console.error("BOOKING ERROR:", error.message)
      console.log("already booked")
      setBookingData(null)
      toast.error(error.response.data.message)
      setBooking(false)

    }
  }



  // CANCLE BOOKING - FIXED VERSION

  const cancleBooking = async (id) => {
    try {
      //  id is the LISTING ID passed from Card component
      // Backend will use this to find the booking and perform cleanup
      let result = await axios.delete(
        serverURL + `/api/booking/cancle/${id}`,
        { withCredentials: true }
      )


      await getCurrentUser()


      await getListing()

      console.log(" Booking cancelled successfully:", result.data)
      toast.success("Booking Canceled Successfully")

    }
    catch (error) {
      console.error(" Error cancelling booking:", error)
      toast.error(error.response?.data?.message || "Failed to cancel booking")
    }
  }







  let value = {
    checkIn, setCheckIn,
    checkOut, setCheckOut,
    total, setTotal,
    night, setNight,
    paymentMethod, setPaymentMethod,
    bookingData, setBookingData,
    handleBooking, cancleBooking, setBooking, booking


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