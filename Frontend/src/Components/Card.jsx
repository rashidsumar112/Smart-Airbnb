import React from 'react'
import { useContext } from 'react'
import { userDataContext } from '../Context/UserContext'
import { listDataContext } from '../Context/ListContext'
import { useNavigate } from 'react-router-dom'
import {FaStar} from "react-icons/fa";
import {GiConfirmed} from "react-icons/gi";



function Card({title,landmark,image1,image2,image3,rent,city,id,ratings,isBooked,host}) {
  let navigate=useNavigate()

let {userData}=useContext(userDataContext)
let {handleViewCard}=useContext(listDataContext)

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
    <div className='w-[300px] max-w-[85%] h-[460px] flex items-start justify-start  flex-col  relative rounded-lg cursor-pointer z-[10]' onClick={()=>!isBooked?handleClick():null}>


{/* //this for showing booked on card */}
{ isBooked && <div className='text-[green] bg-[white] rounded-lg absolute flex items-center justify-center right-1 top-1 gap-[5px] p-[5px]'><GiConfirmed className='w-[20px] h-[20px] text-[green]' />Booked</div>}

{/* for showing Cancle booking message */}
{ isBooked && host== userData?._id && <div className='text-[red] bg-[white] rounded-lg absolute flex items-center justify-center right-1 top-[50px] gap-[5px] p-[5px]'><p className='w-[20px] h-[20px] text-[red] font-semibold' >X</p>Cancled Booking</div>}





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