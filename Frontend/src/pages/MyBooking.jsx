import React, { useContext } from 'react'
import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../Context/UserContext';
import Card from '../Components/Card';


function MyBooking() {
  let navigate=useNavigate()
   let {userData}=useContext(userDataContext)



    console.log("userData.booking raw:", userData?.booking)

console.log("userData.booking raw:", userData?.booking);
  userData?.booking?.forEach(b => console.log("Booking _id:", b._id, "Listing:", b.listing));


   //this my code for error check
   console.log("userData.booking:", userData?.booking)

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

     {/* {userData.booking.map((list)=>(
                   <Card title={list.title} landmark={list.landmark} city={list.city} image1={list.image1} image2={list.image2} image3={list.image3} rent={list.rent} id={list._id} isBooked={list.isBooked} host={list.host} ratings={list.ratings}/>
                 )
           
                 )} */}

                 {/* //change here */}

{/* {userData?.booking?.length > 0 ? (
  userData.booking.map((book) => (
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
      ratings={book.listing.ratings}
      
    />
  ))
) : (
  <p className="text-gray-500 text-xl">No bookings found</p>
)} */}



{/* //this working */}

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
        ratings={book.listing.ratings}
       
      />
    ))
) : (
  <p className="text-gray-500 text-xl">No bookings found</p>
)}


{/* {userData.booking?.map((list)=>(
              <Card title={list.title} landmark={list.landmark} city={list.city} image1={list.image1} image2={list.image2} image3={list.image3} rent={list.rent} id={list._id} isBooked={list.isBooked} host={list.host} ratings={list.ratings}/>
            )
      
            )} */}

        </div>
        
        
        
        
   </div>
  )
}

export default MyBooking