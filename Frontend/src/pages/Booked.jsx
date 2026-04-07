import React, { useState } from 'react'
import { useContext } from 'react';
import {GiConfirmed} from "react-icons/gi";
import { BookingDataContext } from '../Context/BookingContext';
import {FaStar} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Start from '../Components/Start';
import axios from 'axios';
import { authDataContext } from '../Context/AuthContext';
import { userDataContext } from '../Context/UserContext';
import { listDataContext } from '../Context/ListContext';


function Booked() {
let {bookingData}=useContext(BookingDataContext)
let [star,setStar]=useState(null)
let navigate=useNavigate()
let {serverURL}=useContext(authDataContext)
let {getCurrentUser}=useContext(userDataContext)
let {getListing}=useContext(listDataContext)
let {cardDetails}=useContext(listDataContext)




const handleRating=async(id)=>{
  try{
    let result = await axios.post(serverURL + `/api/listing/ratings/${id}`,{
      ratings:star
    },{withCredentials:true})
    await getListing()
    await getCurrentUser()
    console.log(result)
    navigate("/")

  }
  catch{
    console.log(error)

  }
}





const  handleStar=async(value)=>{
  setStar(value)
  console.log("you rated",value)


}







//these are for error check






  return (
    <div className='w-[100vw] min-h-[100vh] flex items-center justify-center gap-[10px] pt-[10px] bg-slate-300 flex-col'>
      <div className='w-[95%] max-w-[500px] h-[300px] bg-[#aee884] flex items-center justify-center border-[1px] border-[#b5b5b5] flex-col gap-[20px] p-[20px] md:w-[80%] rounded-lg'>
       <div className='w-[100%] h-[50%] text-[20px] flex items-center justify-center flex-col gap-[20px] font-semibold'>
        <GiConfirmed className='w-[100px] h-[80px]'/>
        Booking Confirmed
       </div>




        <div className='w-[100%] flex items-center justify-between text-[16px] md:text-[18px]'>
          <span> Booking Id:</span> <span>{bookingData._id}</span>
        </div>


        <div className='w-[100%] flex items-center justify-between text-[16px] md:text-[18px]'>
          <span>Owner Details:</span> <span>{bookingData.host?.email}</span>
        </div>




        <div className='w-[100%] flex items-center justify-between text-[16px] md:text-[18px]'>
          <span> Total Rent:</span> <span>{bookingData.totalRent}</span>
        </div>
      </div>




 <div className='w-[95%] max-w-[600px] h-[200px]  bg-[#aee884] flex items-center justify-center border-[1px] border-[#b5b5b5] flex-col gap-[10px] p-[20px] md:w-[80%] rounded-lg'>
 <h1 className='text-[18px]'> {star} Out of 5 Rating</h1>
 
  <Start onRate={handleStar} />
  <button className='px-[50px] py-[10px] bg-blue-600 text-[white] text-[18px] rounded-lg md:px-[100px] mt-[20px]' onClick={()=>handleRating(cardDetails._id)}>Submit</button>

 </div>
 <button className=' py-[10px] bg-red-600 text-[white] text-[18px] rounded-lg md:px-[20px] mt-[10px] absolute top-[10px] left-[10px]' onClick={()=>navigate("/")}>Back to Home</button>

        
    </div>
  )
}

export default Booked