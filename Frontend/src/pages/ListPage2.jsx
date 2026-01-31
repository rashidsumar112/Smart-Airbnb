import React from 'react'
import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';


import { GiFamilyHouse } from "react-icons/gi";
import { MdBedroomParent } from "react-icons/md";
import { MdOutlinePool } from "react-icons/md";
import { GiWoodCabin } from "react-icons/gi";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { IoBedOutline } from "react-icons/io5";
import { FaTreeCity } from "react-icons/fa6";
import { BiBuildingHouse } from "react-icons/bi";
import { useContext } from 'react';
import { listDataContext } from '../Context/ListContext';




function ListPage2() {

let navigate=useNavigate()

//Hrere we set functionality for all Icons for category
let {category,setCategory}=useContext(listDataContext)


  return (
    <div className='w-[100%] h-[100vh] bg-white flex items-center justify-center relative overflow-auto' >
                 <div className='w-[50px] h-[50px] bg-red-700 cursor-pointer  absolute top-[5%] left-[20px] rounded-[50%] flex items-center justify-center' onClick={()=>navigate("/listpage1")}><IoArrowBackCircle  className='w-[30px] h-[30px] text-[white]' />
                    </div>





                    <div className='w-[200px] h-[50px] text-[18px] bg-red-700 text-[white] flex items-center justify-center rounded-[30px] absolute top-[5%] right-[10px] shadow-lg '>
                      SetUp Your Category 
                    </div>


                    <div className='max-w-[900px] w-[100%] h-[450px]   bg-[white] flex  items-center justify-start flex-col gap-[10px] mt-[40px] overflow-auto'  >
                    <h1 className='text-[18px] text-[black] md:text-[30px] bg-blue-200 rounded-lg p-[6px]  px-[10px]'>
                        Which Of These Best Describe Your Place???
                    </h1>

                

                {/* Category settings Portions */}
                <div className='max-w-[900px] w-[100%] h-[100%] flex flex-wrap items-center justify-center gap-[10px] md:w-[70%]'>
                    {/* //all Icons */}


                 <div className={`w-[180px] h-[100px] flex justify-center items-center flex-col cursor-pointer border-[2px] hover:border-[#a6a5a5] text-[16px] rounded-lg ${category=="villa"? "border-3 border-[#8b8b8b]":""}`} onClick={()=>setCategory("villa")}>
                  <GiFamilyHouse  className='w-[30px] h-[30px] text-black'/>
                      <h3>Villa</h3>
                </div>
                  
                  <div className={`w-[180px] h-[100px] flex justify-center items-center flex-col cursor-pointer border-[2px] hover:border-[#a6a5a5] text-[16px] rounded-lg ${category=="farmhouse"? "border-3 border-[#8b8b8b]":""}`} onClick={()=>setCategory("farmhouse")}>
                  <FaTreeCity 
                    className='w-[30px] h-[30px] text-black'/>
                       <h3>FarmHouse</h3>
                 </div>
                  
                  <div className={`w-[180px] h-[100px] flex justify-center items-center flex-col cursor-pointer border-[2px] hover:border-[#a6a5a5] text-[16px] rounded-lg ${category=="poolhouse"? "border-3 border-[#8b8b8b]":""}`} onClick={()=>setCategory("poolhouse")}>
                  <MdOutlinePool  className='w-[30px] h-[30px] text-black'/>
                       <h3>PoolHouse</h3>
                 </div>
                  
                  <div className={`w-[180px] h-[100px] flex justify-center items-center flex-col cursor-pointer border-[2px] hover:border-[#a6a5a5] text-[16px] rounded-lg ${category=="rooms"? "border-3 border-[#8b8b8b]":""}`} onClick={()=>setCategory("rooms")}>
                  <MdBedroomParent   className='w-[30px] h-[30px] text-black'/>
                       <h3>Rooms</h3>
                 </div>
                  
                  <div className={`w-[180px] h-[100px] flex justify-center items-center flex-col cursor-pointer border-[2px] hover:border-[#a6a5a5] text-[16px] rounded-lg ${category=="flat"? "border-3 border-[#8b8b8b]":""}`} onClick={()=>setCategory("flat")}>
                  <BiBuildingHouse   className='w-[30px] h-[30px] text-black'/>
                       <h3>Flat</h3>
                 </div>
                  
                  <div className={`w-[180px] h-[100px] flex justify-center items-center flex-col cursor-pointer border-[2px] hover:border-[#a6a5a5] text-[16px] rounded-lg ${category=="pg"? "border-3 border-[#8b8b8b]":""}`} onClick={()=>setCategory("pg")}>
                 <IoBedOutline  className='w-[30px] h-[30px] text-black'/>
                      <h3>PG</h3>
                 </div>
                  
                  <div className={`w-[180px] h-[100px] flex justify-center items-center flex-col cursor-pointer border-[2px] hover:border-[#a6a5a5] text-[16px] rounded-lg ${category=="cabin"? "border-3 border-[#8b8b8b]":""}`} onClick={()=>setCategory("cabin")}>
                  <GiWoodCabin  className='w-[30px] h-[30px] text-black'/>
                       <h3>Cabin</h3>
                 </div>
                  
                  <div className={`w-[180px] h-[100px] flex justify-center items-center flex-col cursor-pointer border-[2px] hover:border-[#a6a5a5] text-[16px] rounded-lg ${category=="shops"? "border-3 border-[#8b8b8b]":""}`} onClick={()=>setCategory("shops")}>
                  < SiHomeassistantcommunitystore   className='w-[30px] h-[30px] text-black'/>
                       <h3>Shops</h3>
                 </div>
                  
                </div>

          <button className='px-[50px] py-[10px] bg-blue-600 text-[white] text-[18px] rounded-lg md:px-[80px] mt-[20px] absolute right-[1%] bottom-[5%]' disabled={!category} onClick={()=>navigate("/listpage3")}>Next</button>

                 

            </div>
            




    

    </div>
  )
}

export default ListPage2