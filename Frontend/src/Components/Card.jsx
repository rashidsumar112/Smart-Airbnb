import React from 'react'
import { useContext } from 'react'
import { userDataContext } from '../Context/UserContext'
import { listDataContext } from '../Context/ListContext'
import { useNavigate } from 'react-router-dom'

function Card({title,landmark,image1,image2,image3,rent,city,id}) {
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
    <div className='w-[300px] max-w-[85%] h-[460px] flex items-start justify-start  flex-col rounded-lg cursor-pointer' onClick={handleClick}>
      <div className='w-[100%] h-[67%] bg-[#2e3d2d] rounded-lg flex overflow-x-auto overflow-y-hidden'>
        <img src={image1} alt="rashid mazari" className='w-[100%] flex-shrink-0' />
        <img src={image2} alt="rashid" className='w-[100%]  flex-shrink-0' />
        <img src={image3} alt="rashid" className='w-[100%] flex-shrink-0' />
      </div>
      <div className='w-[100%] h-[33%] py-[5px] flex flex-col gap-[2px]'>
        <span className='w-[80%] text-ellipsis overflow-hidden font-semibold text-[#4a3434]' >{`In ${landmark}, ${city}`}</span>
         <span className='text-[15px] w-[80%] text-ellipsis overflow-hidden text-nowrap'>{title}</span>
          <span className='text-[16px] font-semibold text-[#986b6b]'> Rs {rent} Per Day</span>


      </div>

      
  
    </div>
  )
}

export default Card