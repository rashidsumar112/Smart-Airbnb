// Frontend/src/Components/Navbar.jsx

import React, { useContext, useEffect, useState } from 'react'
import logo from '../assets/logo3.png'
import { FcSearch } from "react-icons/fc";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { MdOutlineWhatshot } from "react-icons/md";
import { GiFamilyHouse } from "react-icons/gi";
import { MdBedroomParent } from "react-icons/md";
import { MdOutlinePool } from "react-icons/md";
import { GiWoodCabin } from "react-icons/gi";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { IoBedOutline } from "react-icons/io5";
import { FaTreeCity } from "react-icons/fa6";
import { BiBuildingHouse } from "react-icons/bi";
import { Link, useNavigate } from 'react-router-dom';
import { authDataContext } from '../Context/AuthContext';
import axios from 'axios';
import { userDataContext } from '../Context/UserContext.jsx';
import { listDataContext } from '../Context/ListContext.jsx';








function Navbar() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================

  // Category filtering state
  let [cate, setCate] = useState()

  // Menu popup state
  let [showPopup, setShowPopup] = useState(false);

  // ============================================
  // ROUTING & CONTEXT
  // ============================================
  //addings functionlity for login navigates

  let navigate = useNavigate();
  //Here we gets Server Url from authDataContext
  let { serverURL } = useContext(authDataContext)

  let { userData, setUserData } = useContext(userDataContext)
  let { getlist, setGetList, newgetlist, setnewGetList, searchData, handleSearch, setSearchData, handleViewCard } = useContext(listDataContext)
  let [input, setInput] = useState("")








  //Logout function can be added here
  const handleLogout = () => {
    //code for logout logic will go here
    try {
      //example: clear user session, redirect to home page, etc.
      let result = axios.post(serverURL + "/api/auth/logout", { withCredentials: true })
      //this null the userData
      setUserData(null)

      console.log("logout successful", result)




    } catch (error) {
      console.log("Error during logout", error)
    }


  }

  const handleCategory = (category) => {
    setCate(category)
    if (category == "trending") {
      setnewGetList(getlist)
    }
    else {
      setnewGetList(getlist.filter((list) => list.category == category
      ))
    }


  }



  const handleClick = (id) => {

    if (userData) {
      handleViewCard(id)
    }
    else {
      navigate("/login")
    }



  }





  // for search functionality
  useEffect(() => {

    handleSearch(input)

  }, [input])








  return (
    <>
      <div className='fixed inset-x-0 top-0 z-[60] overflow-visible'>
        {/* // 1st Navbar container */}
        <div className='relative z-[50] mx-auto flex min-h-[80px] w-full max-w-7xl items-center justify-between border-b border-slate-500/60 bg-gradient-to-r from-slate-700 via-slate-600 to-emerald-600 px-[20px] text-white shadow-[0_18px_40px_rgba(15,23,42,0.14)] backdrop-blur-2xl md:px-[40px] overflow-visible'>
          {/* //Navbar content here */}



          {/* //navbar logo here */}
          <Link to='/' onClick={() => window.scrollTo(0, 0)} className='inline-flex items-center rounded-[20px] border border-sky-300/80 bg-sky-200/80 px-3 py-2 shadow-[0_10px_25px_rgba(14,165,233,0.12)] transition duration-300 hover:border-sky-300 hover:bg-sky-100 hover:shadow-[0_14px_35px_rgba(14,165,233,0.18)]'>
            <img src={logo} alt='Smart Airbnb logo' className='w-[160px] md:w-[190px] rounded-2xl object-cover shadow-lg ring-1 ring-white/20' />
          </Link>




          {/* //Navbar Searchbar here */}
          <div className='group relative ml-[140px] hidden w-[35%] md:block'>
            <div className='flex items-center rounded-[34px] border border-sky-300/80 bg-cyan-100/85 px-[10px] py-[6px] shadow-[0_12px_30px_rgba(14,165,233,0.12)] backdrop-blur-xl transition duration-300 hover:border-sky-400 hover:shadow-[0_16px_40px_rgba(14,165,233,0.16)]'>
              <input type="text" className='w-[100%] rounded-[28px] bg-transparent px-[20px] py-[8px] text-slate-700 outline-none placeholder:text-slate-400 transition duration-300 focus:ring-0' placeholder='Any Where | Any Location | Any City' onChange={(e) => setInput(e.target.value)} value={input} />
              <button className='rounded-full bg-gradient-to-r from-violet-500 to-sky-500 p-[11px] shadow-[0_10px_20px_rgba(139,92,246,0.22)] transition duration-300 hover:-translate-y-0.5 hover:from-violet-400 hover:to-sky-400 hover:shadow-[0_14px_28px_rgba(139,92,246,0.28)]'><FcSearch className='w-[16px] h-[16px] text-[white]' />
              </button>
            </div>
          </div>



          <div className='relative flex items-center justify-center gap-[10px]'>
            <span className='hidden cursor-pointer rounded-full border border-sky-300/80 bg-sky-200/85 px-[12px] py-[7px] text-[17px] font-semibold text-slate-700 shadow-[0_10px_20px_rgba(14,165,233,0.10)] transition duration-300 hover:-translate-y-0.5 hover:border-sky-400 hover:bg-sky-100 hover:text-violet-700 md:block' onClick={() => navigate("/listpage1")}>List Your Home</span>
            <button className='flex items-center justify-center gap-[5px] rounded-[50px] border border-sky-300/80 bg-sky-200/85 px-[20px] py-[10px] text-slate-700 shadow-[0_10px_20px_rgba(14,165,233,0.10)] transition duration-300 hover:-translate-y-0.5 hover:border-sky-400 hover:bg-sky-100 hover:shadow-[0_14px_30px_rgba(14,165,233,0.16)]' onClick={() => setShowPopup(prev => !prev)}>
              <span><GiHamburgerMenu className='w-[20px] h-[20px]' /> </span>
              {userData == null && <span><CgProfile className='w-[23px] h-[23px]' /></span>}
              {userData != null && <span className='w-[30px] h-[30px] rounded-full bg-gradient-to-br from-violet-500 to-sky-500 text-[white] flex items-center justify-center shadow-md'>{userData.name.slice(0, 1)}</span>}

            </button>


            {/* //menu and profile popup can be implemented here */}
            {showPopup && <div className='absolute right-[3%] top-full z-[80] mt-3 h-[250px] w-[220px] rounded-2xl border border-sky-300/70 bg-cyan-100/95 shadow-2xl backdrop-blur-xl md:right-[0%]' onClick={(e) => e.stopPropagation()}>
              <ul className='w-[100%] h-[100%] text-[17px] flex items-start justify-around flex-col py-[10px]'>
                {!userData && <li className='w-[100%] cursor-pointer rounded-lg px-[15px] py-[10px] text-slate-700 transition duration-200 hover:bg-sky-200 hover:text-violet-700' onClick={() => { navigate('/login'); setShowPopup(false) }} >Login</li>}
                {userData && <li className='w-[100%] cursor-pointer rounded-lg px-[15px] py-[10px] text-slate-700 transition duration-200 hover:bg-sky-200 hover:text-violet-700 ' onClick={() => { handleLogout(); setShowPopup(false) }}>Logout</li>}
                <div className='w-[100%] h-[1px] bg-sky-300 '>

                </div>
                <li className='w-[100%] cursor-pointer rounded-lg px-[15px] py-[10px] text-slate-700 transition duration-200 hover:bg-sky-200 hover:text-violet-700' onClick={() => { navigate("/listpage1"); setShowPopup(false) }}>List Your Home</li>
                <li className='w-[100%] cursor-pointer rounded-lg px-[15px] py-[10px] text-slate-700 transition duration-200 hover:bg-sky-200 hover:text-violet-700' onClick={() => { navigate("/mylisting"); setShowPopup(false) }}>My Listing</li>
                <li className='w-[100%] cursor-pointer rounded-lg px-[15px] py-[10px] text-slate-700 transition duration-200 hover:bg-sky-200 hover:text-violet-700' onClick={() => { navigate("/mybooking"); setShowPopup(false) }}>My Booking</li>
              </ul>

            </div>}

          </div>

          {/* for search map */}
          {searchData?.length > 0 &&
            <div className='absolute left-0 top-full z-[80] mt-3 flex h-auto w-[100vw] flex-col items-center justify-start gap-[20px] overflow-visible'>
              <div className='max-w-[700px] w-[100vw] max-h-[300px] overflow-auto flex flex-col rounded-3xl border border-sky-300/70 bg-cyan-100/95 p-[12px] shadow-[0_20px_60px_rgba(14,165,233,0.14)] cursor-pointer'>
                <div className='rounded-2xl bg-sky-200 px-[16px] py-[10px] text-sm font-semibold text-violet-700 shadow-sm backdrop-blur-sm'>
                  Search results
                </div>

                {/* {
               

               }) 

               } */}
                {/* //mobile view search bar */}


                {/* my change */}
                {
                  searchData.map((search, index) => (
                    <div key={index} className='mt-[8px] rounded-2xl border border-sky-200 bg-sky-100/85 p-[12px] transition duration-200 hover:border-sky-300 hover:bg-sky-200/85 hover:text-violet-900' onClick={() => handleViewCard(search._id)}>
                      {search.title} in {search.landmark}, {search.city}
                    </div>
                  ))
                }

              </div>

            </div>}


        </div>



        {/* //mobile view search bar and chat icon */}

        <div className="w-[100%] h-[60px] flex items-center justify-center space-x-2 bg-gradient-to-r from-sky-300 via-cyan-200 to-violet-300 px-2 md:hidden border-b border-sky-300/70">
          {/* Search Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              className="w-full rounded-[30px] border border-sky-300/80 bg-cyan-100/85 px-[30px] py-[8px] text-[17px] text-slate-700 outline-none shadow-sm placeholder:text-slate-400"
              placeholder="Any Where | Any Location | Any City" onChange={(e) => setInput(e.target.value)} value={input}
            />
            <button className="absolute right-[3%] top-[4px] rounded-full bg-gradient-to-r from-violet-500 to-sky-500 p-[10px] shadow-md">
              <FcSearch className="w-[16px] h-[16px] text-white" />
            </button>
          </div>
        </div>







        {/* //2nd navbar */}
        <div className='relative z-[30] mx-auto flex h-[85px] w-full max-w-7xl items-center justify-start gap-[30px] overflow-auto border border-t-0 border-sky-30/70 bg-gradient-to-r from-sky-200 via-cyan-100 to-violet-200 px-[15px] shadow-[0_14px_30px_rgba(14,165,233,0.10)] backdrop-blur-2xl md:justify-center'>
          <div className={`flex items-center justify-center flex-col border-b-[1px] border-transparent text-[13px] text-slate-600 hover:border-violet-100 ${cate == "trending" ? "border-violet-300" : ""}`} onClick={() => { handleCategory("trending"); setCate("") }}>

            <MdOutlineWhatshot className='w-[30px] h-[30px] text-violet-500' />
            <h3 className="mt-1 text-sm font-medium tracking-wide text-slate-700">Trending</h3>
          </div>

          <div className={`flex items-center justify-center flex-col border-b-[1px] border-transparent text-[13px] text-slate-600 hover:border-violet-400 ${cate == "villa" ? "border-violet-500" : ""}`} onClick={() => handleCategory("villa")}>

            <GiFamilyHouse className='w-[30px] h-[30px] text-violet-500' />
            <h3 className="mt-1 text-sm font-medium tracking-wide text-slate-700">Villa</h3>
          </div>

          <div className={`flex items-center justify-center flex-col border-b-[1px] border-transparent text-[13px] text-slate-600 hover:border-violet-400 ${cate == "farmhouse" ? "border-violet-500" : ""}`} onClick={() => handleCategory("farmhouse")}>

            <FaTreeCity className='w-[30px] h-[30px] text-violet-500' />
            <h3 className="mt-1 text-sm font-medium tracking-wide text-slate-700">FarmHouse</h3>
          </div>

          <div className={`flex items-center justify-center flex-col border-b-[1px] border-transparent text-[13px] text-slate-600 hover:border-violet-400 ${cate == "poolhouse" ? "border-violet-500" : ""}`} onClick={() => handleCategory("poolhouse")}>

            <MdOutlinePool className='w-[30px] h-[30px] text-violet-500' />
            <h3 className="mt-1 text-sm font-medium tracking-wide text-slate-700">PoolHouse</h3>
          </div>

          <div className={`flex items-center justify-center flex-col border-b-[1px] border-transparent text-[13px] text-slate-600 hover:border-violet-400 ${cate == "rooms" ? "border-violet-500" : ""}`} onClick={() => handleCategory("rooms")}>

            <MdBedroomParent className='w-[30px] h-[30px] text-violet-500' />
            <h3 className="mt-1 text-sm font-medium tracking-wide text-slate-700">Rooms</h3>
          </div>

          <div className={`flex items-center justify-center flex-col border-b-[1px] border-transparent text-[13px] text-slate-600 hover:border-violet-400 ${cate == "flat" ? "border-violet-500" : ""}`} onClick={() => handleCategory("flat")}>

            <BiBuildingHouse className='w-[30px] h-[30px] text-violet-500' />
            <h3 className="mt-1 text-sm font-medium tracking-wide text-slate-700">Flat</h3>
          </div>

          <div className={`flex items-center justify-center flex-col border-b-[1px] border-transparent text-[13px] text-slate-600 hover:border-violet-400 ${cate == "pg" ? "border-violet-500" : ""}`} onClick={() => handleCategory("pg")}>

            <IoBedOutline className='w-[30px] h-[30px] text-violet-500' />
            <h3 className="mt-1 text-sm font-medium tracking-wide text-slate-700">PG</h3>
          </div>

          <div className={`flex items-center justify-center flex-col border-b-[1px] border-transparent text-[13px] text-slate-600 hover:border-violet-400 ${cate == "cabin" ? "border-violet-500" : ""}`} onClick={() => handleCategory("cabin")}>

            <GiWoodCabin className='w-[30px] h-[30px] text-violet-500' />
            <h3 className="mt-1 text-sm font-medium tracking-wide text-slate-700">Cabin</h3>
          </div>

          <div className={`flex items-center justify-center flex-col border-b-[1px] border-transparent text-[13px] text-slate-600 hover:border-violet-400 ${cate == "shops" ? "border-violet-500" : ""}`} onClick={() => handleCategory("shops")}>

            < SiHomeassistantcommunitystore className='w-[30px] h-[30px] text-violet-500' />
            <h3 className="mt-1 text-sm font-medium tracking-wide text-slate-700">Shops</h3>
          </div>

        </div>

      </div>

    </>
  )
}

export default Navbar