import React, { useContext } from 'react'
import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../Context/UserContext';
import Card from '../Components/Card';



function MyListing() {

    let navigate=useNavigate()
    let {userData}=useContext(userDataContext)
//use  state for uppdates

// let [title,setTitle] = useState("")
//  let [description,setDescription] = useState("")
// let [frontEndImage1,setfrontEndImage1] = useState(null)
// let [frontEndImage2,setfrontEndImage2] = useState(null)
// let [frontEndImage3,setfrontEndImage3] = useState(null)
// let [backEndImage1,setbackEndImage1] = useState(null)
// let [backEndImage2,setbackEndImage2] = useState(null)
// let [backEndImage3,setbackEndImage3] = useState(null)
//  let [rent,setRent] = useState("")
// let [city,setCity] = useState("")
// let [landmark,setLandMark] = useState("")
// let[category,setCategory] =useState("")





    //this my code for error check
    console.log("userData:", userData)
    console.log("userData?.listing:", userData?.listing)
    if(userData?.listing?.length > 0) {
        console.log("First listing item:", userData.listing[0])
    }




   return (
    <div className='w-[100vw] min-h-[100vh] flex items-center justify-start flex-col gap-[20px]  relative overflow-x-hidden overflow-y-auto'>
        <div className='w-[50px] h-[50px] bg-red-700 cursor-pointer justify-center absolute top-[4%] left-[20px] rounded-[50%] flex items-center justify-center' onClick={()=>navigate("/")}><IoArrowBackCircle  className='w-[30px] h-[30px] text-[white]' /></div>


        <div className='w-[50%] h-[10%] border-[2px] border-[#908c8c] p-[5px] flex items-center justify-center text-[30px] rounded-md text-[#613b3b] font-semibold mt-[20px] md:w-[600px]'>
            My Listing
        </div>

        <div className='w-[100%] h-[90%] flex items-center justify-center gap-[20px] flex-wrap mt-[30px]'>


      {/* {userData?.listing?.map((list)=>(
        <Card key={list._id} title={list.title} landmark={list.landmark} city={list.city} image1={list.image1} image2={list.image2} image3={list.image3} rent={list.rent} id={list._id}/>
      ))} */}

       {userData.listing.map((list)=>(
              <Card title={list.title} landmark={list.landmark} city={list.city} image1={list.image1} image2={list.image2} image3={list.image3} rent={list.rent} id={list._id}/>
            )
      
            )}

        </div>
        
        
        
        
   </div>
  )
}

export default MyListing