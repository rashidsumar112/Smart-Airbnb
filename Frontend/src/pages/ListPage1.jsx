import React from 'react'
import { useContext } from 'react';
import { useState } from 'react';
import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { listDataContext } from '../Context/ListContext';





function ListPage1() {
let navigate=useNavigate()
//Here we takes all the Attributes from ListConetxt
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
category,setCategory
}=useContext(listDataContext)

//Here we craete the Handle function to install Images in this we move file to backend and urls to Frontend


//Handle function for image1
const handleImage1 = (e)=>{
  //here we takes files of images from inputs
  let file=e.target.files[0]
  //this moves images from cloudinary then Backend as file 
  setbackEndImage1(file)
  //this create urls of image file 1 and then use it to frontEnd 
  setfrontEndImage1(URL.createObjectURL(file))
}


//Handle function for image2
const handleImage2 = (e)=>{
  //here we takes files of images from inputs
  let file=e.target.files[0]
  //this moves images from cloudinary then Backend as file 
  setbackEndImage2(file)
  //this create urls of image file 2 and then use it ot frontEnd
  setfrontEndImage2(URL.createObjectURL(file))
}


//Handle function for image3
const handleImage3 = (e)=>{
  //here we takes files of images from inputs
  let file=e.target.files[0]
  //this moves images from cloudinary then Backend as file 
  setbackEndImage3(file)
  //this create urls of image file 3 and then use it ot frontEnd
  setfrontEndImage3(URL.createObjectURL(file))
}










  return (
    <div className='w-[100%] h-[100vh] bg-white flex items-center justify-center relative overflow-auto'>
        <form action="" className='max-w-[800px] w-[80%] h-[400px] flex items-center justify-start  flex-col  md:items-start gap-[10px] overflow-auto mt-[30px]' onSubmit={(e)=>{e.preventDefault()
          navigate("/listpage2")}
        }>
            <div className='w-[50px] h-[50px] bg-red-700 cursor-pointer justify-center absolute top-[5%] left-[20px] rounded-[50%] flex items-center justify-center' onClick={()=>navigate("/")}><IoArrowBackCircle  className='w-[30px] h-[30px] text-[white]' />
            </div>
            <div className='w-[200px] h-[50px] text-[20px] bg-red-700 text-[white] flex items-center justify-center rounded-[30px] absolute top-[5%] right-[10px] shadow-lg'>
              SetUp Your Home  
            </div>
  {/* //lable ,input for form */}


      <div className='w-[90%] flex items-start justify-start flex-col gap-[10px]'>
                <label htmlFor="title" className='text-[20px]'>Title</label>
                <input type="text" id='title'className='w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px]' placeholder=' Give Title for Your Property' required  onChange={(e)=>{setTitle(e.target.value)}}  value={title}/>
            </div>



              <div className='w-[90%] flex items-start justify-start flex-col gap-[10px]'>
                <label htmlFor="des" className='text-[20px]'>Description</label>
                <textarea name='' id='des' className='w-[90%] h-[80px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px]' placeholder='Gives a Brief Description about You Property' required  onChange={(e)=>{setDescription(e.target.value)}}  value={description}>
                </textarea>
              </div>





              <div className='w-[90%] flex items-start justify-start flex-col gap-[10px]'>
                <label htmlFor="img1" className='text-[20px]'>Image1</label>
                 <div className='flex items-center justify-start w-[90%] h-[40px] border-[#555656] border-2 rounded-[10px]'>
                <input type="file" id='img1'className='w-[100%]  text-[15px] px-[10px]' required onChange={handleImage1} /></div>
              </div>
               


                <div className='w-[90%] flex items-start justify-start flex-col gap-[10px]'>
                <label htmlFor="img2" className='text-[20px]'>Image2</label>
                 <div className='flex items-center justify-start w-[90%] h-[40px] border-[#555656] border-2 rounded-[10px]'>
                <input type="file" id='img2'className='w-[100%]  text-[15px] px-[10px]' required  onChange={handleImage2} /></div>
              </div>


             

              <div className='w-[90%] flex items-start justify-start flex-col gap-[10px]'>
                <label htmlFor="img3" className='text-[20px]'>Image3</label>
                 <div className='flex items-center justify-start w-[90%] h-[40px] border-[#555656] border-2 rounded-[10px]'>
                <input type="file" id='img3'className='w-[100%]  text-[15px] px-[10px]' required onChange={handleImage3} /></div>
              </div>

              

              <div className='w-[90%] flex items-start justify-start flex-col gap-[10px]'>
                <label htmlFor="rent" className='text-[20px]'>Rent</label>
                <input type="number" id='rent'className='w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px]'placeholder='Rs----/ Day' required onChange={(e)=>{setRent(e.target.value)}}  value={rent} />
            </div>



            <div className='w-[90%] flex items-start justify-start flex-col gap-[10px]'>
                <label htmlFor="city" className='text-[20px]'>City</label>
                <input type="text" id='city'className='w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px]' placeholder='City or Country' required  onChange={(e)=>{setCity(e.target.value)}}  value={city}/>
            </div>



            <div className='w-[90%] flex items-start justify-start flex-col gap-[10px]'>
                <label htmlFor="lanmark" className='text-[20px]'>LandMark</label>
                <input type="text" id='lanmark'className='w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px]' required onChange={(e)=>{setLandMark(e.target.value)}}  value={landmark}  />
            </div>



            <button className='px-[50px] py-[10px] bg-blue-600 text-[white] text-[18px] rounded-lg md:px-[100px] mt-[20px]'>Next</button>









        </form>
      
    </div>
  )
}

export default ListPage1