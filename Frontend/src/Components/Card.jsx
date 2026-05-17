import React, { useState, useEffect, useContext } from 'react'
import { userDataContext } from '../Context/UserContext'
import { listDataContext } from '../Context/ListContext'
import { useNavigate } from 'react-router-dom'
import {FaStar} from "react-icons/fa";
import {GiConfirmed} from "react-icons/gi";
import { BookingDataContext } from '../Context/BookingContext'
import { authDataContext } from '../Context/AuthContext'
import axios from 'axios'



// 🎫 Card accepts both host and guest to allow cancellation from both sides
function Card({title,landmark,image1,image2,image3,rent,city,id,ratings,isBooked,host,guest,createdAt,bookingId}) {
  let navigate=useNavigate()
  let {serverURL}=useContext(authDataContext)

let {userData}=useContext(userDataContext)
let {handleViewCard}=useContext(listDataContext)
let [popUp,setPopUp]=useState(false)
let [errorPopUp,setErrorPopUp]=useState(false) // 🚫 ⏰ NEW: Error popup for expired cancellation
let {cancleBooking}=useContext(BookingDataContext)

let [bookedDates, setBookedDates] = useState([])

// ✨ NEW: Fetch booked dates when card mounts
useEffect(() => {
  if(isBooked && id) {
    fetchBookedDates()
  } else {
    setBookedDates([])
  }
}, [isBooked, id])

// ✨ NEW FUNCTION: Fetch booked dates from backend
const fetchBookedDates = async() => {
  try {
    let result = await axios.get(
      serverURL + `/api/booking/booked-dates/${id}`
    )
    setBookedDates(result.data)
    console.log("✅ Booked dates fetched:", result.data)
  } catch(error) {
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
  if(!bookedDates.length) return []
  return bookedDates.map((p) => `${formatDate(p.checkIn)} - ${formatDate(p.checkOut)}`)
}

// 🚫 ⏰ NEW: CHECK IF 1 HOUR HAS PASSED SINCE BOOKING CREATION
// Only guests cannot cancel after 1 hour; hosts can always cancel
const canCancelBooking = () => {
  const isGuest = guest === userData?._id
  
  if(!isGuest) return true // Hosts can always cancel
  
  if(!createdAt) return true // If no creation date, allow cancellation
  
  const bookingCreatedTime = new Date(createdAt).getTime()
  const currentTime = new Date().getTime()
  const timeDifference = currentTime - bookingCreatedTime
  const oneHourInMilliseconds = 1 * 60 * 60 * 1000 // 1 hour
  
  return timeDifference <= oneHourInMilliseconds // Return true if within 1 hour
}

// 🚫 ⏰ NEW: FORMAT TIME REMAINING MESSAGE FOR GUESTS
const getTimeRemainingMessage = () => {
  if(!createdAt) return ""
  
  const bookingCreatedTime = new Date(createdAt).getTime()
  const currentTime = new Date().getTime()
  const timeDifference = currentTime - bookingCreatedTime
  const oneHourInMilliseconds = 1 * 60 * 60 * 1000
  
  if(timeDifference > oneHourInMilliseconds) {
    const hoursElapsed = Math.floor(timeDifference / (60 * 60 * 1000))
    return `Cancellation expired (${hoursElapsed}h ago)`
  }
  
  const timeRemaining = oneHourInMilliseconds - timeDifference
  const hoursRemaining = Math.floor(timeRemaining / (60 * 60 * 1000))
  const minutesRemaining = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000))
  
  return `You Can Cancel only within ${hoursRemaining}h ${minutesRemaining}m`
}

//this function is for make card clickable

const handleClick=()=>{
 
  if(userData){
    handleViewCard(id)
  }
  else{
    navigate("/login")
  }
}




  return (
    <div className='w-[300px] max-w-[85%] h-[460px] flex items-start justify-start  flex-col  relative rounded-lg cursor-pointer z-[10]' onClick={handleClick}>


{/* //this for showing booked on card */}
{ isBooked && <div className='text-[green] bg-[white] rounded-lg absolute flex flex-col items-start justify-center right-1 top-1 gap-[4px] p-[6px] max-w-[220px] text-left'>
  <div className='flex items-center justify-start gap-[6px] w-full'>
    <GiConfirmed className='w-[18px] h-[18px] text-[green]' />
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
{ userData && isBooked && (host == userData._id || guest == userData._id) && 
  <div className={`text-[red] bg-[white] rounded-lg absolute flex items-center justify-center right-1 top-[50px] gap-[5px] p-[5px] ${
    (guest === userData?._id && !canCancelBooking()) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  }`} onClick={(e) => {
    e.stopPropagation()
    if(!canCancelBooking() && guest === userData?._id) {
      setErrorPopUp(true) // 🚫 ⏰ NEW: Show error if guest tries to cancel after 1 hour
    } else {
      setPopUp(true)
    }
  }}>
    <p className='w-[20px] h-[20px] text-[red] font-semibold' >X</p>
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

<div className='w-[300px] h-[100px] bg-[#ffffffdf] absolute top-[110px] left-[13px] rounded-lg'>
  <div className='w-[100%] h-[50%] text-[#2e2d2d] flex items-start justify-center rounded-lg overflow-auto text-[20px]  p-[10px]'>Booking Cancle!</div>

  {/* 🔧 IMPORTANT: The 'id' parameter here is the LISTING ID (not booking ID)
      Backend will:
      1. Find the booking document using this listing ID
      2. Delete booking from Booking collection
      3. Remove booking._id from both host AND guest users
      4. Set listing.isBooked = false
      5. Clear the guest reference from listing
      This ensures complete cleanup from ALL collections in MongoDB
  */}

  <div className='w-[100%] h-[50%] text-[18px] font-semibold flex items-start justify-center gap-[10px] text-[#986b6b]'>
    Are You Sure? <button className='px-[20px] bg-[red] text-[white] rounded-lg hover:bg-slate-600' onClick={()=>{
      cancleBooking(bookingId || id);setPopUp(false)}}>Yes</button>

    <button className='px-[10px] bg-[red] text-[white] rounded-lg hover:bg-slate-600' onClick={()=>setPopUp(false)} >No</button>
  </div> 
</div>}

{/* 🚫 ⏰ NEW: Error popup when guest tries to cancel after 1 hour deadline */}
{errorPopUp &&
<div className='w-[300px] h-[120px] bg-[#ffcccc] absolute top-[110px] left-[13px] rounded-lg border-2 border-[red]'>
  <div className='w-[100%] h-[60%] text-[#8b0000] flex items-start justify-center rounded-lg overflow-auto text-[16px] font-bold p-[10px]'>
     Cancellation Period Expired!
  </div>
  <div className='w-[100%] h-[40%] text-[13px] flex items-center justify-center gap-[5px] text-[#8b0000] p-[5px]'>
    <span>You can only cancel within 1 hour of booking</span>
    <button className='px-[15px] bg-[red] text-[white] rounded-lg hover:bg-slate-600 text-[12px]' onClick={()=>setErrorPopUp(false)}>OK</button>
  </div> 
</div>}






      <div className='w-[100%] h-[67%] bg-[#2e3d2d] rounded-lg flex overflow-x-auto overflow-y-hidden'>
        <img src={image1} alt="rashid mazari" className='w-[100%] flex-shrink-0' />
        <img src={image2} alt="rashid" className='w-[100%]  flex-shrink-0' />
        <img src={image3} alt="rashid" className='w-[100%] flex-shrink-0' />
      </div>
      <div className='w-[100%] h-[33%] py-[5px] flex flex-col gap-[2px]'>
        <div className='flex items-center justify-between text-[18px]'><span className='w-[80%] text-ellipsis overflow-hidden font-semibold text-[#4a3434]' >{`In ${landmark}, ${city}`}</span>
        <span className='flex items-center justify-center gap-[5px]'><FaStar  className='text-[#eb6262]'/>{ratings}</span>
        </div>
         <span className='text-[15px] w-[80%] text-ellipsis overflow-hidden text-nowrap'>{title}</span>
          <span className='text-[16px] font-semibold text-[#986b6b]'> Rs {rent} Per Night</span>


      </div>

      
  
    </div>
  )
}

export default Card