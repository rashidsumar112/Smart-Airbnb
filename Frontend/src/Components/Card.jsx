import React from 'react'

function Card({title,landmark,image1,image2,image3,rent,city,id}) {
  return (
    <div className='w-[300px] max-w-[85%] h-[460px] flex items-start justify-start  flex-col rounded-lg cursor-pointer  '>
      <div className='w-[100%] h-[67%] bg-[#2e3d2d] rounded-lg overflow-auto'>
        <img src={image1} alt="rashid mazari" className='w-[100%] flex-shrink-0' />
        <img src={image2} alt="rashid" className='w-[100%]  flex-shrink-0' />
        <img src={image3} alt="rashid" className='w-[100%] flex-shrink-0' />
      </div>
      <div className='w-[100%] h-[33%] py-[20px] flex flex-col gap-[2px]'>
        <span>{`In ${landmark}, ${city}`}</span>
         <span></span>
          <span></span>


      </div>

      
  
    </div>
  )
}

export default Card