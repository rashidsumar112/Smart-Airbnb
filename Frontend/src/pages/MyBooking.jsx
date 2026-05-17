import React, { useContext } from 'react'
import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../Context/UserContext';
import Card from '../Components/Card';


function MyBooking() {
  let navigate=useNavigate()
   let {userData}=useContext(userDataContext)


if (userData?.booking?.length > 0) {
  console.log("First booking:", userData.booking[0])
}
   


   return (
    <div className='w-[95vw] min-h-[100vh] flex items-center justify-start flex-col gap-[20px]  relative overflow-x-hidden overflow-y-auto'>
        <div className='w-[50px] h-[50px] bg-red-700 cursor-pointer justify-center absolute top-[4%] left-[20px] rounded-[50%] flex items-center justify-center' onClick={()=>navigate("/")}><IoArrowBackCircle  className='w-[30px] h-[30px] text-[white]' /></div>


        <div className=' text-nowrap w-[50%] h-[10%] border-[2px] border-[#908c8c] p-[5px] flex items-center justify-center text-[30px] rounded-md text-[#613b3b] font-semibold mt-[80px] md:w-[600px]'>
            My Bookings
        </div>

        <div className='w-[100%] h-[90%] flex items-center justify-center gap-[20px] flex-wrap mt-[30px]'>

    

{/* //this working */}

{/*  NEW: Pass guest parameter so guests can cancel their own bookings */}
{/*  NEW: Pass createdAt for 1-day cancellation deadline check */}
{userData?.booking?.length > 0 ? (
  userData.booking.map(book => (
      <Card
        key={book._id}
         
        title={book.listing.title}
        city={book.listing.city}
        landmark={book.listing.landmark}
        image1={book.listing.image1}
        image2={book.listing.image2}
        image3={book.listing.image3}
        rent={book.totalRent}
        id={book.listing._id}
        isBooked={true}
        host={book.listing.host}
        guest={book.guest}
        ratings={book.listing.ratings}
        createdAt={book.createdAt}
        bookingId={book._id}
       
      />
    ))
) : (
  <h1 className='text-[30px] font-semibold text-gray-500'>
          No Bookings Found
        </h1>
)}




        </div>
        
        
        
        
   </div>
  )
}

export default MyBooking