// Frontend/src/Components/Navbar.jsx

import React, { useContext, useEffect, useState } from 'react'
import logo from '../assets/logo6.png'
import logos from '../assets/logos.png'
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
import { listDataContext } from '../Context/ListContext.jsx';

// ============================================
// 🤖 CHATBOT COMPONENT IMPORT
// ============================================
// Imported beautiful chatbot component
// Features: Location-based suggestions, AI responses
// This will be rendered at the bottom of navbar
import Chatbot from './Chatbot';








function Navbar() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  // Category filtering state
  let [cate,setCate]=useState()

  // Menu popup state
  let [showPopup, setShowPopup] = useState(false);
  
  // ============================================
  // 🤖 CHATBOT STATE ADDITION
  // ============================================
  // Controls whether chatbot window is visible
  // true = chatbot open, false = chatbot closed
  // Updated when user clicks chat icon or close button
  let [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // ============================================
  // ROUTING & CONTEXT
  // ============================================
  //addings functionlity for login navigates

  let navigate = useNavigate();
//Here we gets Server Url from authDataContext
 let {serverURL}=useContext(authDataContext)

let {userData,setUserData}=useContext(userDataContext)
let{getlist,setGetList,newgetlist,setnewGetList,searchData,handleSearch,setSearchData,handleViewCard}=useContext(listDataContext)
let [input,setInput]=useState("")








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

const handleCategory = (category)=>{
  setCate(category)
  if(category=="trending"){
    setnewGetList(getlist)
  }
  else{
  setnewGetList(getlist.filter((list)=>list.category==category
  ))
}


}



const handleClick=(id)=>{
 
  if(userData){
    handleViewCard(id)
  }
  else{
    navigate("/login")
  }



}





// for search functionality
useEffect(()=>{

handleSearch(input)
  
},[input])








  return (
    <>
    <div className=' fixed top-0 bg-[#aee884] z-[20]'>
    {/* // 1st Navbar container */}
   <div className='w-[100vw] min-h-[80px]  border-b-[1px] border-[#dcdcdcd] px-[20px] flex items-center justify-between md:px-[40px] '>
    {/* //Navbar content here */}



      {/* //navbar logo here */}
      <div>
        <img src={logo} alt="" className='w-[80px] '></img>
      </div>




      {/* //Navbar Searchbar here */}
      <div  className='w-[35%] relative  ml-[140px] hidden md:block'>
     <input type="text" className='w-[100%] px-[30px] py-[8px] border-[2px] border-[#bdbaba] outline-none overflow-auto  rounded-[30px] ' placeholder='Any Where | Any Loaction | Any City' onChange={(e)=>setInput(e.target.value)} value={input} />
     <button className='absolute p-[10px] rounded-[50px] bg-[red] right-[3%] top-[4px]'><FcSearch className='w-[16px] h-[16px] text-[white]' />
     </button>
      </div>


  
  <div className='flex items-center justify-center gap-[10px] relative  '>
  
  {/* 
    ============================================
    🤖 CHAT ICON - DESKTOP VERSION (ADDITION)
    ============================================
    Features:
    - FaRocketchat icon from react-icons
    - Clickable to open beautiful chatbot window
    - Hover background color change
    - Tooltip text shows on hover: "Hi 👋 How can I help you?"
    - Hidden on mobile (hidden md:block)
    - Calls setIsChatbotOpen(true) when clicked
  */}
  <div className="relative group cursor-pointer p-[10px] rounded-full hover:bg-[#ededed] transition hidden md:block" onClick={() => setIsChatbotOpen(true)}>

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

        <span className='text-[18px] cursor-pointer rounded-[50px] hover:bg-[#ded9d9] px-[8px] py-[5px] hidden md:block' onClick={()=>navigate("/listpage1")}>List Your Home</span>
        <button className='px-[20px] py-[10px] flex items-center justify-center gap-[5px] border-[1px] border-[#8d8c8c] rounded-[50px] hover:shadow-lg' onClick={()=>setShowPopup(prev=>!prev)}>
          <span><GiHamburgerMenu  className='w-[20px] h-[20px]'/> </span>
          {userData==null && <span><CgProfile className='w-[23px] h-[23px]'/></span>}
          { userData!= null &&<span className='w-[30px] h-[30px] bg-[#080808] text-[white] rounded-full flex items-center justify-center'>{userData.name.slice(0,1)}</span>}

        </button>


      {/* //menu and profile popup can be implemented here */}
      {showPopup && <div className='w-[220px] h-[250px] absolute bg-slate-50 top-[110%]  right-[3%] border-[1px] border-[#aaa9a9] z-10 rounded-lg md:right md:right-[0%]'>
        <ul className='w-[100%] h-[100%] text-[17px] flex items-start justify-around flex-col py-[10px]'>
         { !userData && <li className='w-[100%] px-[15px] py-[10px] hover:bg-[#aee884] rounded-lg cursor-pointer' onClick={()=>{navigate('/login');setShowPopup(false)}} >Login</li>}
          {userData && <li className='w-[100%] px-[15px] py-[10px] hover:bg-[#aee884] rounded-lg cursor-pointer ' onClick={()=>{handleLogout();setShowPopup(false)}}>Logout</li>}
          <div className='w-[100%] h-[1px] bg-[#c1c0c0] '>

          </div>
          <li className='w-[100%] px-[15px] py-[10px] hover:bg-[#aee884] rounded-lg cursor-pointer' onClick={()=>{navigate("/listpage1");setShowPopup(false)}}>List Your Home</li>
          <li className='w-[100%] px-[15px] py-[10px] hover:bg-[#aee884] rounded-lg cursor-pointer'  onClick={()=>{navigate("/mylisting");setShowPopup(false)}}>My Listing</li>
          <li className='w-[100%] px-[15px] py-[10px] hover:bg-[#aee884] rounded-lg cursor-pointer' onClick={()=>{navigate("/mybooking");setShowPopup(false)}}>My Booking</li>
        </ul>

        </div>}

      </div>

      {/* for search map */}
      { searchData?.length > 0 && 
        <div className='w-[100vw] h-[450px] flex flex-col gap-[20px] absolute top-[50%] overflow-auto left-[0] justify-start items-center'>
        <div className='max-w-[700px] w-[100vw] h-[300px] overflow-hidden flex flex-col bg-[#fefdfd] p-[20px] rounded-lg border-[1px] border-[#a21a1a] cursor-pointer'>

               {/* {
               SearchData.map((search)=>{
                <div className='border-b border-[black] p-[10px]'>
                  { search.title } in {search.landmark},{search.city}

                </div>

               }) 

               } */}



               {/* my change */}
     {
    searchData.map((search, index) => (
  <div key={index} className='border-b border-[black] p-[10px]' onClick={()=>handleViewCard(search._id)}>
    {search.title} in {search.landmark}, {search.city}
  </div>
))
}

        </div>

      </div>}


     </div>



{/* //mobile view search bar and chat icon */}

      <div className="w-[100%] h-[60px] flex items-center justify-center space-x-2 block md:hidden px-2">
  {/* Search Input */}
  <div className="flex-1 relative">
    <input
      type="text"
      className="w-full px-[30px] py-[8px] border-[2px] border-[#bdbaba] outline-none rounded-[30px] text-[17px]"
      placeholder="Any Where | Any Location | Any City"  onChange={(e)=>setInput(e.target.value)} value={input}
    />
    <button className="absolute p-[10px] rounded-full bg-red-500 right-[3%] top-[4px]">
      <FcSearch className="w-[16px] h-[16px] text-white" />
    </button>
  </div>

  {/* 
    ============================================
    🤖 CHAT ICON - MOBILE VERSION (ADDITION)
    ============================================
    Features:
    - Same as desktop version but visible on mobile
    - FaRocketchat icon from react-icons
    - Clickable to open beautiful chatbot window
    - Hover background color change
    - Tooltip text shows on hover: "Hi 👋 How can I help you?"
    - Visible on mobile (block md:hidden)
    - Calls setIsChatbotOpen(true) when clicked
  */}
  <div className="relative group cursor-pointer p-[10px] rounded-full hover:bg-[#ededed] transition flex items-center justify-center" onClick={() => setIsChatbotOpen(true)}>
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
    <div className={`flex items-center justify-center flex-col hover:border-b-[1px] border-[#a6a5a5] text-[13px] ${cate=="trending"?"border-b-[1px] border-[#a65a5a]":""}`} onClick={()=>{handleCategory("trending");setCate("")}}>
     
     <MdOutlineWhatshot  className='w-[30px] h-[30px] text-black'/>
     <h3 className="mt-1 text-sm font-medium text-gray-700 tracking-wide">Trending</h3>
    </div>

<div className={`flex items-center justify-center flex-col hover:border-b-[1px] border-[#a6a5a5] text-[13px] ${cate=="villa"?"border-b-[1px] border-[#a65a5a]":""}`} onClick={()=>handleCategory("villa")}>
     
     <GiFamilyHouse  className='w-[30px] h-[30px] text-black'/>
     <h3 className="mt-1 text-sm font-medium text-gray-700 tracking-wide">Villa</h3>
    </div>

    <div className={`flex items-center justify-center flex-col hover:border-b-[1px] border-[#a6a5a5] text-[13px] ${cate=="farmhouse"?"border-b-[1px] border-[#a65a5a]":""}`} onClick={()=>handleCategory("farmhouse")}>
     
     <FaTreeCity 
  className='w-[30px] h-[30px] text-black'/>
     <h3 className="mt-1 text-sm font-medium text-gray-700 tracking-wide">FarmHouse</h3>
    </div>

    <div className={`flex items-center justify-center flex-col hover:border-b-[1px] border-[#a6a5a5] text-[13px] ${cate=="poolhouse"?"border-b-[1px] border-[#a65a5a]":""}`} onClick={()=>handleCategory("poolhouse")}>
     
     <MdOutlinePool  className='w-[30px] h-[30px] text-black'/>
     <h3 className="mt-1 text-sm font-medium text-gray-700 tracking-wide">PoolHouse</h3>
    </div>

    <div className={`flex items-center justify-center flex-col hover:border-b-[1px] border-[#a6a5a5] text-[13px] ${cate=="rooms"?"border-b-[1px] border-[#a65a5a]":""}`} onClick={()=>handleCategory("rooms")}>
     
     <MdBedroomParent   className='w-[30px] h-[30px] text-black'/>
     <h3 className="mt-1 text-sm font-medium text-gray-700 tracking-wide">Rooms</h3>
    </div>

    <div className={`flex items-center justify-center flex-col hover:border-b-[1px] border-[#a6a5a5] text-[13px] ${cate=="flat"?"border-b-[1px] border-[#a65a5a]":""}`} onClick={()=>handleCategory("flat")}>
     
     <BiBuildingHouse   className='w-[30px] h-[30px] text-black'/>
     <h3 className="mt-1 text-sm font-medium text-gray-700 tracking-wide">Flat</h3>
    </div>

    <div className={`flex items-center justify-center flex-col hover:border-b-[1px] border-[#a6a5a5] text-[13px] ${cate=="pg"?"border-b-[1px] border-[#a65a5a]":""}`} onClick={()=>handleCategory("pg")}>
     
     <IoBedOutline  className='w-[30px] h-[30px] text-black'/>
     <h3 className="mt-1 text-sm font-medium text-gray-700 tracking-wide">PG</h3>
    </div>

    <div className={`flex items-center justify-center flex-col hover:border-b-[1px] border-[#a6a5a5] text-[13px] ${cate=="cabin"?"border-b-[1px] border-[#a65a5a]":""}`} onClick={()=>handleCategory("cabin")}>
     
     <GiWoodCabin  className='w-[30px] h-[30px] text-black'/>
     <h3 className="mt-1 text-sm font-medium text-gray-700 tracking-wide">Cabin</h3>
    </div>

    <div className={`flex items-center justify-center flex-col hover:border-b-[1px] border-[#a6a5a5] text-[13px] ${cate=="shops"?"border-b-[1px] border-[#a65a5a]":""}`} onClick={()=>handleCategory("shops")}>
     
     < SiHomeassistantcommunitystore   className='w-[30px] h-[30px] text-black'/>
     <h3 className="mt-1 text-sm font-medium text-gray-700 tracking-wide">Shops</h3>
    </div>

    </div>  
 
</div>

      {/* 
        ============================================
        🤖 CHATBOT COMPONENT RENDERING (ADDITION)
        ============================================
        Renders beautiful chatbot window at the bottom
        
        Props:
        - isOpen={isChatbotOpen}
          Controls visibility of chatbot window
          true = displayed, false = hidden
          
        - onClose={() => setIsChatbotOpen(false)}
          Callback function when user clicks X button
          Closes the chatbot window
        
        When user clicks chat icon:
        1. isChatbotOpen state becomes true
        2. Chatbot window appears at bottom-right
        3. User can type messages and chat
        4. When X button clicked, onClose fires
        5. isChatbotOpen becomes false
        6. Chatbot window disappears
      */}
      <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </>
  )
}

export default Navbar