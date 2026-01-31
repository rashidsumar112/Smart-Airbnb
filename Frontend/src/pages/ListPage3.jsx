import React from 'react'
import { useContext } from 'react';
import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { listDataContext } from '../Context/ListContext';

function ListPage3() {

let navigate=useNavigate()

let {
  title,setTitle,
description,setDescription,
frontEndImage1,setfrontEndImage1,
frontEndImage2,setfrontEndImage2,
frontEndImage3,setfrontEndImage3,
backEndImage1,setbackEndImage1,
backEndImage2,setbackEndImage2,
backEndImage3,setbackEndImage3,
rent,setRent,
city,setCity,
landmark,setLandMark,
category,setCategory,
handleaddList,
adding,setAdding
}=useContext(listDataContext)




  return (
      <div className='w-[100%] h-[100vh] bg-[white] flex items-center justify-center gap-[2px] flex-col overflow-auto relative'>

        {/* //arrow for back */}
        <div className='w-[50px] h-[50px] bg-red-700 cursor-pointer  absolute top-[5%] left-[20px] rounded-[50%] flex items-center justify-center' onClick={()=>navigate("/listpage2")}><IoArrowBackCircle  className='w-[30px] h-[30px] text-[white]' />
        </div>

      {/* //for Title of image */}

        <div className='w-[95%] flex items-start justify-start text-[25px] md:w-[80%] mb-[10px]'>
         
         <h1 className='text-[20px] text-[#272727] md:text-[30px] text-ellipsis text-nowrap overflow-hidden'>
          {`In ${landmark.toUpperCase()},  ${city.toUpperCase()}`}
         </h1>
        </div>

        {/* for Image on page */}
        <div className='w-[95%] h-[280px] flex items-center justify-center flex-col md:w-[80%] md:flex-row '>
          {/* //three div for 3 images */}


          <div className='w-[100%] h-[65%] md:w-[70%] md:h-[100%] overflow-hidden flex items-center justify-center border-[1px] border-[white] '>
            <img src={frontEndImage1} alt="" className='w-[100%]' />
          </div>


          <div className='w-[100%] h-[50%] flex items-center justify-center md:w-[50%] md:h-[100%] md:flex-col '>

          <div className='w-[100%] h-[100%] overflow-hidden flex items-center border-[1px]'>
         <img src={frontEndImage2} alt="" className='w-[100%]'  />
          </div>
          <div className='w-[100%] h-[100%] overflow-hidden flex items-center border-[1px] '>
            <img src={frontEndImage3} alt="" className='w-[100%]' />
              </div>
           </div>
        </div>
        

        <div className='w-[95%] flex items-start justify-start text-[18px] md:w-[80%] md:text-[25px] '>
        {`${title.toUpperCase()} ${category}, ${landmark}`}
        </div>
        <div className='w-[95%] flex items-start justify-start text-gray-800 text-[18px] md:w-[80%] md:text-[25px] '>
        {`${description}`}
        </div>
        <div className='w-[95%] flex items-start justify-start text-[18px] md:w-[80%] md:text-[25px]'>
        {`Rs.${rent} Per Day`}
        </div>


        <button className='px-[50px] py-[10px] bg-blue-600 text-[white] text-[18px] rounded-lg md:px-[80px] mt-[20px] absolute right-[30%] bottom-[5%]' onClick={handleaddList} disabled={adding}>{adding?"Adding...":"Add Listing"}</button>
        
        
        
        </div>
  )
}

export default ListPage3