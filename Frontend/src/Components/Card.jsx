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
function Card({title,landmark,image1,image2,image3,rent,city,id,ratings,isBooked,host,guest,createdAt}) {
  let navigate=useNavigate()
  let {serverURL}=useContext(authDataContext)

let {userData}=useContext(userDataContext)
let {handleViewCard}=useContext(listDataContext)
let [popUp,setPopUp]=useState(false)
let [errorPopUp,setErrorPopUp]=useState(false) // 🚫 ⏰ NEW: Error popup for expired cancellation
let {cancleBooking}=useContext(BookingDataContext)

// ✨ NEW: State for booked dates popup
let [showBookedPopup, setShowBookedPopup] = useState(false)
let [bookedDates, setBookedDates] = useState([])

// ✨ NEW: Fetch booked dates when card mounts
useEffect(() => {
  if(isBooked && id) {
    fetchBookedDates()
  }
}, [isBooked, id])

// 🔒🔒🔒 NEW: AUTO-CLOSE POPUP FOR HOST & CURRENT GUEST 🔒🔒🔒
// Make sure popup NEVER shows for host or the guest who booked it
useEffect(() => {
  if(isBooked && userData) {
    const isHost = host === userData._id
    const isCurrentGuest = guest === userData._id
    
    // Close popup if current user is host or the guest who booked
    if((isHost || isCurrentGuest) && showBookedPopup) {
      setShowBookedPopup(false) // 💬 Auto-close for host/current guest
    }
  }
}, [isBooked, userData, host, guest, showBookedPopup])

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
  
  return `Cancel within ${hoursRemaining}h ${minutesRemaining}m`
}

//this function is for make card clickable

const handleClick=()=>{
 
  if(userData){
    // ✨ UPDATED: If listing is booked, show popup ONLY for new guests (not for host or current guest)
    if(isBooked) {
      const isHost = host === userData._id
      const isCurrentGuest = guest === userData._id
      
      // ⭐⭐⭐ KEY CHANGE: ONLY show booked popup for NEW GUESTS ⭐⭐⭐
      // - NEW GUEST (not host, not current guest) → Shows "Already Booked" popup ✅
      // - HOST (who listed it) → Shows "Cancel Booking" button ✅
      // - CURRENT GUEST (who booked it) → Shows "Cancel Booking" button ✅
      if(!isHost && !isCurrentGuest) {
        setShowBookedPopup(true) // 💬 Show booked dates popup ONLY to new guests
        return
      }
      
      // 🔒🔒🔒 NEW FIX: DISABLE CARD CLICK FOR HOST & CURRENT GUEST 🔒🔒🔒
      // When host or guest views their booked listing, the card is NOT clickable
      // Only the "Cancel Booking" button will work - nothing else
      if(isHost || isCurrentGuest) {
        return // ⛔ Disable card navigation completely - only cancel button works
      }
    }
    handleViewCard(id)
  }
  else{
    navigate("/login")
  }
}




  return (
    <div className='w-[300px] max-w-[85%] h-[460px] flex items-start justify-start  flex-col  relative rounded-lg cursor-pointer z-[10]' onClick={handleClick}>


{/* //this for showing booked on card */}
{ isBooked && <div className='text-[green] bg-[white] rounded-lg absolute flex items-center justify-center right-1 top-1 gap-[5px] p-[5px]'><GiConfirmed className='w-[20px] h-[20px] text-[green]' />Booked</div>}
 {/* isBooked && host == userData?._id && */}

{/* ✨ NEW: Popup for already booked listings */}
{showBookedPopup &&
<div className='w-[320px] bg-[#fff8dc] absolute top-[50px] left-[-10px] rounded-lg border-2 border-[#ff6b6b] shadow-lg z-[100] p-[15px]'>
  <div className='w-[100%] text-center mb-[10px]'>
    <div className='text-[16px] font-bold text-[#d32f2f] mb-[10px]'>
      ⚠️ This listing is already booked!
    </div>
    <div className='text-[14px] text-[#666] mb-[15px]'>
      Booked dates:
    </div>
   
    {/* Display all booked dates */}
    <div className='flex flex-col gap-[8px] mb-[15px]'>
      {bookedDates && bookedDates.length > 0 ? (
        bookedDates.map((period, idx) => (
          <div key={idx} className='bg-[#ffe0e0] rounded p-[8px] text-[13px]'>
            <p className='text-[#d32f2f] font-semibold'>
              {formatDate(period.checkIn)} - {formatDate(period.checkOut)}
            </p>
          </div>
        ))
      ) : (
        <p className='text-[13px] text-[#666]'>Checking availability...</p>
      )}
    </div>

    <div className='text-[13px] text-[#ff6b6b] font-semibold mb-[10px]'>
      📅 Please Comes after above Booked Dates to book this listing
    </div>
  </div>
  
  <button 
    className='w-[100%] px-[15px] py-[8px] bg-[#d32f2f] text-[white] rounded-lg hover:bg-[#b71c1c] text-[14px] font-semibold' 
    onClick={(e) => {
      e.stopPropagation()
      setShowBookedPopup(false)
    }}
  >
    Close
  </button>
</div>}

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
      cancleBooking(id);setPopUp(false)}}>Yes</button>

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
          <span className='text-[16px] font-semibold text-[#986b6b]'> Rs {rent} Per Day</span>


      </div>

      
  
    </div>
  )
}

export default Card