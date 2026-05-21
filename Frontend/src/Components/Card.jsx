import React, { useState, useEffect, useContext } from 'react'
import { userDataContext } from '../Context/UserContext'
import { listDataContext } from '../Context/ListContext'
import { useNavigate } from 'react-router-dom'
import { FaStar } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import { BookingDataContext } from '../Context/BookingContext'
import { authDataContext } from '../Context/AuthContext'
import axios from 'axios'



// 🎫 Card accepts both host and guest to allow cancellation from both sides
function Card({ title, landmark, image1, image2, image3, rent, city, id, ratings, isBooked, host, guest, createdAt, bookingId }) {
  let navigate = useNavigate()
  let { serverURL } = useContext(authDataContext)

  let { userData } = useContext(userDataContext)
  let { handleViewCard } = useContext(listDataContext)
  let [popUp, setPopUp] = useState(false)
  let [errorPopUp, setErrorPopUp] = useState(false) // 🚫 ⏰ NEW: Error popup for expired cancellation
  let { cancleBooking } = useContext(BookingDataContext)

  let [bookedDates, setBookedDates] = useState([])

  // ✨ NEW: Fetch booked dates when card mounts
  useEffect(() => {
    if (isBooked && id) {
      fetchBookedDates()
    } else {
      setBookedDates([])
    }
  }, [isBooked, id])

  // ✨ NEW FUNCTION: Fetch booked dates from backend
  const fetchBookedDates = async () => {
    try {
      let result = await axios.get(
        serverURL + `/api/booking/booked-dates/${id}`
      )
      setBookedDates(result.data)
      console.log("✅ Booked dates fetched:", result.data)
    } catch (error) {
      console.log("❌ Error fetching booked dates:", error)
    }
  }

  // ✨ NEW HELPER FUNCTION: Format dates nicely for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US',
      { year: 'numeric', month: 'short', day: 'numeric' }
    )
  }

  // Return full list of booked ranges (array of strings)
  const getBookedRanges = () => {
    if (!bookedDates.length) return []
    return bookedDates.map((p) => `${formatDate(p.checkIn)} - ${formatDate(p.checkOut)}`)
  }

  // 🚫 ⏰ NEW: CHECK IF 1 HOUR HAS PASSED SINCE BOOKING CREATION
  // Only guests cannot cancel after 1 hour; hosts can always cancel
  const canCancelBooking = () => {
    const isGuest = guest === userData?._id

    if (!isGuest) return true // Hosts can always cancel

    if (!createdAt) return true // If no creation date, allow cancellation

    const bookingCreatedTime = new Date(createdAt).getTime()
    const currentTime = new Date().getTime()
    const timeDifference = currentTime - bookingCreatedTime
    const oneHourInMilliseconds = 1 * 60 * 60 * 1000 // 1 hour

    return timeDifference <= oneHourInMilliseconds // Return true if within 1 hour
  }

  // 🚫 ⏰ NEW: FORMAT TIME REMAINING MESSAGE FOR GUESTS
  const getTimeRemainingMessage = () => {
    if (!createdAt) return ""

    const bookingCreatedTime = new Date(createdAt).getTime()
    const currentTime = new Date().getTime()
    const timeDifference = currentTime - bookingCreatedTime
    const oneHourInMilliseconds = 1 * 60 * 60 * 1000

    if (timeDifference > oneHourInMilliseconds) {
      const hoursElapsed = Math.floor(timeDifference / (60 * 60 * 1000))
      return `Cancellation expired (${hoursElapsed}h ago)`
    }

    const timeRemaining = oneHourInMilliseconds - timeDifference
    const hoursRemaining = Math.floor(timeRemaining / (60 * 60 * 1000))
    const minutesRemaining = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000))

    return `You Can Cancel only within ${hoursRemaining}h ${minutesRemaining}m`
  }

  //this function is for make card clickable

  const handleClick = () => {

    if (userData) {
      handleViewCard(id)
    }
    else {
      navigate("/login")
    }
  }




  return (
    <div className='group relative z-[10] flex h-[450px] w-full max-w-[285px] cursor-pointer flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.10)] ring-1 ring-slate-200/70 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.16)]' onClick={handleClick}>


      {/* //this for showing booked on card */}
      {isBooked && <div className='absolute right-2 top-2 max-w-[220px] rounded-xl border border-emerald-200 bg-white/95 p-[6px] text-left text-emerald-700 shadow-md'>
        <div className='flex items-center justify-start gap-[6px] w-full'>
          <GiConfirmed className='w-[18px] h-[18px] text-emerald-500' />
          <span className='font-semibold text-[13px]'>Booked</span>
        </div>
        {bookedDates.length > 0 && (
          <div className='text-[11px] text-[#666] max-h-[96px] overflow-auto w-[100%] mt-[4px]'>
            {getBookedRanges().map((r, idx) => (
              <div key={idx} className='leading-[1.1]'>
                {r}
              </div>
            ))}
          </div>
        )}
      </div>}
      {/* isBooked && host == userData?._id && */}

      {/* for showing Cancle booking message */}
      {/* 📝 This button appears when: isBooked=true AND (current user is the host OR current user is the guest) */}
      {/* When clicked, it opens a confirmation popup where user must click "Yes" to confirm cancellation */}
      {/* ⭐ NEW: Guest users can now also cancel their bookings from "My Bookings" page */}
      {/* 🚫 ⏰ NEW: Added 1-day cancellation deadline check for guests */}
      {/* 🔒 FIX: Added userData check to prevent showing cancel button to logged-out users */}
      {userData && isBooked && (host == userData._id || guest == userData._id) &&
        <div className={`absolute right-2 top-[52px] flex items-center justify-center gap-[5px] rounded-xl border border-rose-200 bg-white/95 p-[6px] text-rose-600 shadow-md ${(guest === userData?._id && !canCancelBooking()) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`} onClick={(e) => {
            e.stopPropagation()
            if (!canCancelBooking() && guest === userData?._id) {
              setErrorPopUp(true) // 🚫 ⏰ NEW: Show error if guest tries to cancel after 1 hour
            } else {
              setPopUp(true)
            }
          }}>
          <p className='h-[20px] w-[20px] font-semibold text-rose-600' >X</p>
          {guest === userData?._id ? (
            <div className='flex flex-col items-center'>
              <span>Cancle Booking</span>
              {/* 🚫 ⏰ NEW: Show countdown or expiration message for guests */}
              <span className='text-[10px] text-[#808080]'>{getTimeRemainingMessage()}</span>
            </div>
          ) : (
            <span>Cancle Booking</span>
          )}
        </div>
      }




      {popUp &&

        <div className='absolute left-[13px] top-[110px] h-[100px] w-[300px] rounded-xl border border-white/70 bg-white/95 shadow-xl'>
          <div className='flex h-[50%] w-[100%] items-start justify-center overflow-auto rounded-lg p-[10px] text-[20px] text-slate-700'>Booking Cancle!</div>

          {/* 🔧 IMPORTANT: The 'id' parameter here is the LISTING ID (not booking ID)
      Backend will:
      1. Find the booking document using this listing ID
      2. Delete booking from Booking collection
      3. Remove booking._id from both host AND guest users
      4. Set listing.isBooked = false
      5. Clear the guest reference from listing
      This ensures complete cleanup from ALL collections in MongoDB
  */}

          <div className='flex h-[50%] w-[100%] items-start justify-center gap-[10px] text-[18px] font-semibold text-slate-500'>
            Are You Sure? <button className='rounded-lg bg-rose-600 px-[20px] text-[white] hover:bg-rose-700' onClick={() => {
              cancleBooking(bookingId || id); setPopUp(false)
            }}>Yes</button>

            <button className='rounded-lg bg-slate-800 px-[10px] text-[white] hover:bg-slate-700' onClick={() => setPopUp(false)} >No</button>
          </div>
        </div>}

      {/* 🚫 ⏰ NEW: Error popup when guest tries to cancel after 1 hour deadline */}
      {errorPopUp &&
        <div className='absolute left-[13px] top-[110px] h-[120px] w-[300px] rounded-xl border border-rose-200 bg-rose-50 shadow-xl'>
          <div className='flex h-[60%] w-[100%] items-start justify-center overflow-auto rounded-lg p-[10px] text-[16px] font-bold text-rose-800'>
            Cancellation Period Expired!
          </div>
          <div className='flex h-[40%] w-[100%] items-center justify-center gap-[5px] p-[5px] text-[13px] text-rose-800'>
            <span>You can only cancel within 1 hour of booking</span>
            <button className='rounded-lg bg-rose-600 px-[15px] text-[12px] text-[white] hover:bg-rose-700' onClick={() => setErrorPopUp(false)}>OK</button>
          </div>
        </div>}






      <div className='flex h-[67%] w-[100%] overflow-x-auto overflow-y-hidden rounded-t-[28px] bg-slate-900'>
        <img src={image1} alt="rashid mazari" className='w-[100%] flex-shrink-0' />
        <img src={image2} alt="rashid" className='w-[100%]  flex-shrink-0' />
        <img src={image3} alt="rashid" className='w-[100%] flex-shrink-0' />
      </div>
      <div className='flex h-[33%] w-[100%] flex-col gap-[6px] bg-gradient-to-b from-white to-slate-50 px-4 py-4'>
        <div className='flex items-center justify-between text-[18px]'><span className='w-[80%] overflow-hidden text-ellipsis font-semibold text-slate-800' >{`In ${landmark}, ${city}`}</span>
          <span className='flex items-center justify-center gap-[5px] text-slate-700'><FaStar className='text-amber-500' />{ratings}</span>
        </div>
        <span className='w-[80%] overflow-hidden text-ellipsis text-nowrap text-[15px] text-slate-600'>{title}</span>
        <span className='text-[16px] font-semibold text-sky-700'> Rs {rent} Per Night</span>


      </div>



    </div>
  )
}

export default Card