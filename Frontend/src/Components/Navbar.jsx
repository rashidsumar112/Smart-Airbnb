// Frontend/src/Components/Navbar.jsx

import React, { useContext, useState } from 'react'
import logo from '../assets/logo.png'
import { FcSearch } from "react-icons/fc";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";

import { FaRocketchat } from "react-icons/fa";
import { MdOutlineWhatshot } from "react-icons/md";
import { GiFamilyHouse } from "react-icons/gi";
import { MdBedroomParent } from "react-icons/md";
import { MdOutlinePool } from "react-icons/md";
import { GiWoodCabin } from "react-icons/gi";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { IoBedOutline } from "react-icons/io5";
import { FaTreeCity } from "react-icons/fa6";
import { BiBuildingHouse } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { authDataContext } from '../Context/AuthContext';
import axios from 'axios';
import { userDataContext } from '../Context/UserContext.jsx';







function Navbar() {

let [showPopup, setShowPopup] = useState(false);

//addings functionlity for login navigates

let navigate = useNavigate();
//Here we gets Server Url from authDataContext
 let {serverURL}=useContext(authDataContext)

let {userData,setUserData}=useContext(userDataContext)








//Logout function can be added here
const handleLogout=()=>{
  //code for logout logic will go here
  try{
    //example: clear user session, redirect to home page, etc.
    let result=axios.post(serverURL + "/api/auth/logout", {withCredentials:true})
    //this null the userData
    setUserData(null)

    console.log("logout successful",result)




  }catch(error){
    console.log("Error during logout",error)
  }


}










  return (

    <div>
    {/* // 1st Navbar container */}
   <div className='w-[100vw] min-h-[80px]  border-b-[]1px border-[#dcdcdcd] px-[20px] flex items-center justify-between md:px-[40px]'>
    {/* //Navbar content here */}



      {/* //navbar logo here */}
      <div>
        <img src={logo} alt="" className='w-[80px]'></img>
      </div>




      {/* //Navbar Searchbar here */}
      <div  className='w-[35%] relative  ml-[140px] hidden md:block'>
     <input type="text" className='w-[100%] px-[30px] py-[8px] border-[2px] border-[#bdbaba] outline-none overflow-auto  rounded-[30px] ' placeholder='Any Where | Any Loaction | Any City'/>
     <button className='absolute p-[10px] rounded-[50px] bg-[red] right-[3%] top-[4px]'><FcSearch className='w-[16px] h-[16px] text-[white]' />
     </button>
      </div>


  
  <div className='flex items-center justify-center gap-[10px] relative  '>
  {/* Chat Icon with hover message */}
    <div className="relative group cursor-pointer p-[10px] rounded-full hover:bg-[#ededed] transition hidden md:block">

     <FaRocketchat className="w-[22px] h-[22px] text-[#555]" />

       {/* Tooltip */}
       <div className="
         absolute top-[110%] right-0
         bg-black text-white text-[12px]
           px-[10px] py-[6px] rounded-md
          opacity-0 scale-95
          group-hover:opacity-100 group-hover:scale-100
          transition-all duration-200
          whitespace-nowrap
           pointer-events-none
           ">
           Hi 👋 How can I help you?
          </div>
      </div>

        <span className='text-[18px] cursor-pointer rounded-[50px] hover:bg-[#ded9d9] px-[8px] py-[5px] hidden md:block'>List Your Home</span>
        <button className='px-[20px] py-[10px] flex items-center justify-center gap-[5px] border-[1px] border-[#8d8c8c] rounded-[50px] hover:shadow-lg' onClick={()=>setShowPopup(prev=>!prev)}>
          <span><GiHamburgerMenu  className='w-[20px] h-[20px]'/> </span>
          {userData==null && <span><CgProfile className='w-[23px] h-[23px]'/></span>}
          { userData!= null &&<span className='w-[30px] h-[30px] bg-[#080808] text-[white] rounded-full flex items-center justify-center'>{userData.name.slice(0,1)}</span>}

        </button>


      {/* //menu and profile popup can be implemented here */}
      {showPopup && <div className='w-[220px] h-[250px] absolute bg-slate-50 top-[110%]  right-[3%] border-[1px] border-[#aaa9a9] z-10 rounded-lg md:right'>
        <ul className='w-[100%] h-[100%] text-[17px] flex items-start justify-around flex-col py-[10px]'>
          <li className='w-[100%] px-[15px] py-[10px] hover:bg-[#f4f3f3] cursor-pointer' onClick={()=>navigate('/login')}>Login</li>
          <li className='w-[100%] px-[15px] py-[10px] hover:bg-[#f4f3f3] cursor-pointer' onClick={handleLogout}>Logout</li>
          <div className='w-[100%] h-[1px] bg-[#c1c0c0] '>

          </div>
          <li className='w-[100%] px-[15px] py-[10px] hover:bg-[#f4f3f3] cursor-pointer'>List Your Home</li>
          <li className='w-[100%] px-[15px] py-[10px] hover:bg-[#f4f3f3] cursor-pointer'>My Listing</li>
          <li className='w-[100%] px-[15px] py-[10px] hover:bg-[#f4f3f3] cursor-pointer'>Check Booking</li>
        </ul>

        </div>}

      </div>


     </div>



{/* //mobile view search bar and chat icon */}

      <div className="w-[100%] h-[60px] flex items-center justify-center space-x-2 block md:hidden px-2">
  {/* Search Input */}
  <div className="flex-1 relative">
    <input
      type="text"
      className="w-full px-[30px] py-[8px] border-[2px] border-[#bdbaba] outline-none rounded-[30px] text-[17px]"
      placeholder="Any Where | Any Location | Any City"
    />
    <button className="absolute p-[10px] rounded-full bg-red-500 right-[3%] top-[4px]">
      <FcSearch className="w-[16px] h-[16px] text-white" />
    </button>
  </div>

  {/* Chat Icon */}
  <div className="relative group cursor-pointer p-[10px] rounded-full hover:bg-[#ededed] transition flex items-center justify-center">
    <FaRocketchat className="w-[22px] h-[22px] text-[#555]" />

    {/* Tooltip */}
    <div className="
      absolute top-[110%] right-0
      bg-black text-white text-[12px]
      px-[10px] py-[6px] rounded-md
      opacity-0 scale-95
      group-hover:opacity-100 group-hover:scale-100
      transition-all duration-200
      whitespace-nowrap
      pointer-events-none
    ">
      Hi 👋 How can I help you?
    </div>
  </div>
</div>







{/* //2nd navbar */}
   <div className='w-[100vw] h-[85px] bg-white flex items-center justify-start cursor-pointer  gap-[30px] overflow-auto md:justify-center px-[15px]'>
    <div className='flex items-center justify-center flex-col hover:border-b-[1px] border-[#a6a5a5] text-[13px]'>
     
     <MdOutlineWhatshot  className='w-[30px] h-[30px] text-black'/>
     <h3>Trending</h3>
    </div>

<div className='flex items-center justify-center flex-col hover:border-b-[1px] border-[#a6a5a5] text-[13px]'>
     
     <GiFamilyHouse  className='w-[30px] h-[30px] text-black'/>
     <h3>Villa</h3>
    </div>

    <div className='flex items-center justify-center flex-col hover:border-b-[1px] border-[#a6a5a5] text-[13px]'>
     
     <FaTreeCity 
  className='w-[30px] h-[30px] text-black'/>
     <h3>FarmHouse</h3>
    </div>

    <div className='flex items-center justify-center flex-col hover:border-b-[1px] border-[#a6a5a5] text-[13px]'>
     
     <MdOutlinePool  className='w-[30px] h-[30px] text-black'/>
     <h3>PoolHouse</h3>
    </div>

    <div className='flex items-center justify-center flex-col hover:border-b-[1px] border-[#a6a5a5] text-[13px]'>
     
     <MdBedroomParent   className='w-[30px] h-[30px] text-black'/>
     <h3>Rooms</h3>
    </div>

    <div className='flex items-center justify-center flex-col hover:border-b-[1px] border-[#a6a5a5] text-[13px]'>
     
     <BiBuildingHouse   className='w-[30px] h-[30px] text-black'/>
     <h3>Flat</h3>
    </div>

    <div className='flex items-center justify-center flex-col hover:border-b-[1px] border-[#a6a5a5] text-[13px]'>
     
     <IoBedOutline  className='w-[30px] h-[30px] text-black'/>
     <h3>PG</h3>
    </div>

    <div className='flex items-center justify-center flex-col hover:border-b-[1px] border-[#a6a5a5] text-[13px]'>
     
     <GiWoodCabin  className='w-[30px] h-[30px] text-black'/>
     <h3>Cabin</h3>
    </div>

    <div className='flex items-center justify-center flex-col hover:border-b-[1px] border-[#a6a5a5] text-[13px]'>
     
     < SiHomeassistantcommunitystore   className='w-[30px] h-[30px] text-black'/>
     <h3>Shops</h3>
    </div>

    </div>  

</div>
  )
}

export default Navbar