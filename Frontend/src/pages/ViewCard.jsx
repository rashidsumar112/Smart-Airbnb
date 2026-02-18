import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { listDataContext } from '../Context/ListContext';
import { userDataContext } from '../Context/UserContext';


import axios from 'axios';
import { authDataContext } from '../Context/AuthContext';
import {FaStar} from "react-icons/fa";
import BookingContext, { BookingDataContext } from '../Context/BookingContext';
import { toast } from 'react-toastify';








function ViewCard() {
let {serverURL}=useContext(authDataContext)

let {userData}=useContext(userDataContext)

  let navigate=useNavigate()

  let {cardDetails}=useContext(listDataContext)

  let {updating,setUpdating}=useContext(listDataContext)
  let {deleting,setDeleting}=useContext(listDataContext)


  //for editing popup
  let [updatePopUp,setupdatePopUp]=useState(false)
 let [bookPopUp,setBookPopUp]=useState(false)
//use states for the Listupdate
 let [title,setTitle] = useState(cardDetails.title)
  let [description,setDescription] = useState(cardDetails.description)
 let [backEndImage1,setbackEndImage1] = useState(null)
 let [backEndImage2,setbackEndImage2] = useState(null)
 let [backEndImage3,setbackEndImage3] = useState(null)
  let [rent,setRent] = useState(cardDetails.rent)
 let [city,setCity] = useState(cardDetails.city)
 let [landmark,setLandMark] = useState(cardDetails.landmark)

 let [minDate,setMinDate]=useState("")


 //For booking
 let {checkIn,setCheckIn,
  checkOut,setCheckOut,
  total,setTotal,
  night,setNight,handleBooking,booking,setBooking
}=useContext(BookingDataContext)
 
//calculating booking bill 

   useEffect(()=>{
  if(checkIn && checkOut){
    let inDate= new Date(checkIn)
    let OutDate= new Date(checkOut)
    let n = (OutDate - inDate)/(24*60*60*1000)
    setNight(n)
    let airBnbCharge=(cardDetails.rent*(7/100))
    let tax = (cardDetails.rent*(7/100))
    if(n>0){
      setTotal((cardDetails.rent *n) + airBnbCharge + tax)
    }
    else{
      setTotal(0)
    }
  }
},[checkIn,checkOut,cardDetails.rent,total])


//handle update form changes
  const handleUpdateListing=async()=>{
    setUpdating(true)

    try{

    let formData = new FormData()
    formData.append("title",title)
    // formData.append("image1",backEndImage1)
    // formData.append("image2",backEndImage2)
    // formData.append("image3",backEndImage3)
    if (backEndImage1) {
  formData.append("image1", backEndImage1)
}

if (backEndImage2) {
  formData.append("image2", backEndImage2)
}

if (backEndImage3) {
  formData.append("image3", backEndImage3)
}



    
    formData.append("description",description)
    formData.append("rent",rent)
    formData.append("city",city)
    formData.append("landmark",landmark)
  
    
    
    let result= await axios.post(serverURL + `/api/listing/update/${cardDetails._id}`,formData,{withCredentials:true})
    setUpdating(false)
   
    console.log(result)
    
    navigate("/")
     toast.success("Listing Updated Successfully")
    //here we clear form after adding list aand move to home
      setTitle("")
      setDescription("")
        setbackEndImage1(null)
        setbackEndImage2(null)
        setbackEndImage3(null)
        setRent("")
        setCity("")
        setLandMark("")
       
        
    
        }
        catch(error){
        
            setUpdating(false)
             toast.error(error.response.data.message)
            console.log(error)
    
        }

  }

const handleImage1 = (e)=>{
  //here we takes files of images from inputs
  let file=e.target.files[0]
  //this moves images from cloudinary then Backend as file 
  setbackEndImage1(file)
  
}


//Handle function for image2
const handleImage2 = (e)=>{
  //here we takes files of images from inputs
  let file=e.target.files[0]
  //this moves images from cloudinary then Backend as file 
  setbackEndImage2(file)
 
}


//Handle function for image3
const handleImage3 = (e)=>{
  //here we takes files of images from inputs
  let file=e.target.files[0]
  //this moves images from cloudinary then Backend as file 
  setbackEndImage3(file)
 
}


const handleDeleteListing=async()=>{
  setDeleting(true)
  try{
    let result= await axios.delete(serverURL + `/api/listing/delete/${cardDetails._id}`,{withCredentials:true})
    console.log(result.data)
    navigate("/")
    setDeleting(false)

  }
  catch(error){
    console.log(error)
    setDeleting(false)

  }
}


//useEffect for today Date
useEffect(()=>{
  let today=new Date().toISOString().split('T')[0]
  setMinDate(today)
},[])








  return (
   <div className='w-[100%] h-[100vh] bg-[white] flex items-center justify-center gap-[2px] flex-col overflow-auto relative'>
   
           {/* //arrow for back */}
           <div className='w-[50px] h-[50px] bg-red-700 cursor-pointer  absolute top-[5%] left-[20px] rounded-[50%] flex items-center justify-center' onClick={()=>navigate("/")}><IoArrowBackCircle  className='w-[30px] h-[30px] text-[white]' />
           </div>
   
         {/* //for Title of image */}
   
           <div className='w-[95%] flex items-start justify-start text-[25px] md:w-[80%] mb-[10px]'>
            
            <h1 className='text-[20px] text-[#272727] md:text-[30px] text-ellipsis text-nowrap overflow-hidden'>
             {`In ${cardDetails.landmark}, ${cardDetails.city}`}
            </h1>
           </div>
   
           {/* for Image on page */}
           <div className='w-[95%] h-[280px] flex items-center justify-center flex-col md:w-[80%] md:flex-row '>
             {/* //three div for 3 images */}
   
   
             <div className='w-[100%] h-[65%] md:w-[70%] md:h-[100%] overflow-hidden flex items-center justify-center border-[1px] border-[white] '>
               <img src={cardDetails.image1} alt="" className='w-[100%]' />
             </div>
   
   
             <div className='w-[100%] h-[50%] flex items-center justify-center md:w-[50%] md:h-[100%] md:flex-col '>
   
             <div className='w-[100%] h-[100%] overflow-hidden flex items-center border-[1px]'>
            <img src={cardDetails.image2} alt="" className='w-[100%]'  />
             </div>
             <div className='w-[100%] h-[100%] overflow-hidden flex items-center border-[1px] '>
               <img src={cardDetails.image3} alt="" className='w-[100%]' />
                 </div>
              </div>
           </div>
           
   
           <div className='w-[95%] flex items-start justify-start text-[18px] md:w-[80%] md:text-[25px] '>
           {`${cardDetails.title} ,${cardDetails.category}, ${cardDetails.landmark}`}
           </div>
           <div className='w-[95%] flex items-start justify-start text-gray-800 text-[18px] md:w-[80%] md:text-[25px] '>
           {cardDetails.description}
           </div>
           <div className='w-[95%] flex items-start justify-start text-[18px] md:w-[80%] md:text-[25px]'>
           {`Rs.${ cardDetails.rent} Per Day`}
           </div>
   
   
          { cardDetails.host==userData._id &&<button className='px-[50px] py-[10px] bg-blue-600 text-[white] text-[18px] rounded-lg md:px-[80px] mt-[20px] absolute right-[30%] bottom-[5%] text-nowrap' onClick={()=>setupdatePopUp(pre=>!pre)}>Edit Listing</button>}

          {  cardDetails.host!=userData._id && <button className='px-[50px] py-[10px] bg-blue-600 text-[white] text-[18px] rounded-lg md:px-[80px] mt-[20px] absolute right-[30%] bottom-[5%] text-nowrap' onClick={()=>setBookPopUp(pre=>!pre)} >Reserve</button>}



          {/* //Upadte Listing Page */}

          { updatePopUp && <div className='w-[100%] h-[100%] flex items-center justify-center bg-[#000000c6] absolute top-[0px] z-[100] backdrop-blur-sm'>


          <p className='w-[40px] h-[40px] bg-green-700 cursor-pointer  absolute top-[6%] left-[25px] rounded-[50%] flex items-center justify-center' onClick={()=>setupdatePopUp(false)}>X</p>


           
       {/* //here form for Edit */}

        <form action="" className='max-w-[800px] w-[80%] h-[400px] flex items-center justify-start  flex-col   gap-[10px] overflow-auto mt-[30px] text-[white] bg-[#272727] p-[20px] rounded-lg' onSubmit={(e)=>{e.preventDefault()}} >
       
                   <div className='w-[200px] h-[50px] text-[20px] bg-red-700 text-[white] flex items-center justify-center rounded-[30px] absolute top-[5%] right-[10px] shadow-lg'>
                     Update Your Details  
                   </div>
         {/* //lable ,input for form */}
       
       
             <div className='w-[90%] flex items-start justify-start flex-col gap-[10px]'>
                       <label htmlFor="title" className='text-[20px]'>Title</label>
                       <input type="text" id='title'className='w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px] text-[black]' placeholder=' Give Title for Your Property' required  onChange={(e)=>setTitle(e.target.value)} value={title} />
                   </div>
       
       
       
                     <div className='w-[90%] flex items-start justify-start flex-col gap-[10px]'>
                       <label htmlFor="des" className='text-[20px]'>Description</label>
                       <textarea name='' id='des' className='w-[90%] h-[80px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px] text-[black]' placeholder='Gives a Brief Description about You Property' required onChange={(e)=>setDescription(e.target.value)} value={description} >
                       </textarea>
                     </div>
       
       
       
       
       
                     <div className='w-[90%] flex items-start justify-start flex-col gap-[10px]'>
                       <label htmlFor="img1" className='text-[20px]'>Image1</label>
                        <div className='flex items-center justify-start w-[90%] h-[40px] border-[#555656] border-2 rounded-[10px]'>
                       <input type="file" id='img1'className='w-[100%]  text-[15px] px-[10px] text-[black]'   onChange={handleImage1} /></div>
                     </div>
                      
       
       
                       <div className='w-[90%] flex items-start justify-start flex-col gap-[10px]'>
                       <label htmlFor="img2" className='text-[20px]'>Image2</label>
                        <div className='flex items-center justify-start w-[90%] h-[40px] border-[#555656] border-2 rounded-[10px]'>
                       <input type="file" id='img2'className='w-[100%]  text-[15px] px-[10px] text-[black]'   onChange={handleImage2} /></div>
                     </div>
       
       
                    
       
                     <div className='w-[90%] flex items-start justify-start flex-col gap-[10px]'>
                       <label htmlFor="img3" className='text-[20px]'>Image3</label>
                        <div className='flex items-center justify-start w-[90%] h-[40px] border-[#555656] border-2 rounded-[10px]'>
                       <input type="file" id='img3'className='w-[100%]  text-[15px] px-[10px] text-[black]'   onChange={handleImage3} /></div>
                     </div>
       
                     
       
                     <div className='w-[90%] flex items-start justify-start flex-col gap-[10px]'>
                       <label htmlFor="rent" className='text-[20px]'>Rent</label>
                       <input type="number" id='rent'className='w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px] text-[black]'placeholder='Rs----/ Day' required onChange={(e)=>setRent(e.target.value)} value={rent}  />
                   </div>
       
       
       
                   <div className='w-[90%] flex items-start justify-start flex-col gap-[10px]'>
                       <label htmlFor="city" className='text-[20px]'>City</label>
                       <input type="text" id='city'className='w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px] text-[black]' placeholder='City or Country' required onChange={(e)=>setCity(e.target.value)} value={city} />
                   </div>
       
       
       
                   <div className='w-[90%] flex items-start justify-start flex-col gap-[10px]'>
                       <label htmlFor="lanmark" className='text-[20px]'>LandMark</label>
                       <input type="text" id='lanmark'className='w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px] text-[black]' required onChange={(e)=>setLandMark(e.target.value)} value={landmark} />
                   </div>
       
       
       
                   <button className='px-[50px] py-[10px] bg-blue-600 text-[white] text-[18px] rounded-lg md:px-[100px] mt-[20px] text-nowrap' onClick={handleUpdateListing} disabled={updating}>{updating?"Updating...":"Update Listing"}</button>

                    <button className='px-[50px] py-[10px] bg-blue-600 text-[white] text-[18px] rounded-lg md:px-[100px] mt-[20px] text-nowrap' disabled={deleting} onClick={handleDeleteListing}>{deleting?"deleting...":"Delete Listings"}</button>

       
               </form>


          </div>}


          {/* //pop for Booking  */}
          { bookPopUp &&
          <div className='w-[100%] h-[100%] flex items-center justify-center flex-col gap-[20px] bg-[#ffffffcd] absolute top-[0px] z-[100] backdrop-blur-sm  p-[20px]  md:flex-row md:gap-[100px]'>

           <p className='w-[40px] h-[40px] bg-[red] cursor-pointer  absolute top-[6%] left-[25px] rounded-[50%] flex items-center justify-center' onClick={()=>setBookPopUp(false)}>X</p>



           



          <form className='max-w-[450px] w-[90%] h-[450px] overflow-auto bg-[#aee884] p-[20px] rounded-lg flex items-center justify-start flex-col gap-[10px]  order-[1px] border-[#dedddd] ' onSubmit={(e)=>{e.preventDefault()}}>
            <h1 className=' flex items-center justify-center text-[25px] py-[10px] w-[100%] border-b-[1px] border-[#a3a3a3]'>Confirm & Book</h1>

            <div className='w-[100%] h-[70%]  rounded-lg   p-[10px] '>


              <h3 className='text-[19px] font-semibold'>Your Trip -</h3>


              <div className='w-[90%] flex items-center justify-start gap-[24px] mt-[20px] md:justify-center flex-col md:flex-row md:items-start'>
                       <label htmlFor="checkIn" className='text-[18px] md:text-[20]'>CheckIn</label>
                       <input type="date" min={minDate} id='checkIn'className=' border-[#555656] border-2 w-[170px] h-[40px] rounded-[10px] bg-transparent px-[10px] text-[15px] md:text-[18px] ' required  onChange={(e)=>setCheckIn(e.target.value)}  value={checkIn}/>
                   </div>



                    <div className='w-[90%] flex items-center justify-start gap-[10px] mt-[40px] md:justify-center flex-col md:flex-row md:items-start'>
                       <label htmlFor="checkOut" className='text-[18px] md:text-[20]'>CheckOut</label>
                       <input type="date" min={minDate}id='checkout'className=' border-[#555656] border-2 w-[170px] h-[40px] rounded-[10px] bg-transparent px-[10px] text-[15px] md:text-[18px] ' required  onChange={(e)=>setCheckOut(e.target.value)}  value={checkOut}/>
                   </div>

                       <div className='w-[100%] flex items-center justify-center text-nowrap'>
                    <button className='px-[80px] py-[10px] bg-blue-600 text-[white] text-[18px] md:px-[100px]  rounded-lg   mt-[30px]'onClick={()=>handleBooking(cardDetails._id)} disabled={booking}>
                      {booking?"Booking...":"Book Now"}
                      </button>
                    </div>
       



            </div>




          </form>


          <div className='max-w-[450px] w-[90%] h-[450px] bg-[#aee884] p-[20px] rounded-lg flex items-center justify-center flex-col gap-[10px] border-[1px] border-[#e2e1e1]'>

            <div className='w-[95%] h-[35%] border-[1px]  border-[#abaaaa] rounded-lg flex justify-center items-center gap-[8px] p-[20px]  overflow-hidden '>
              <div className='w-[70px] h-[90px] flex items-center justify-center flex-shrink-0 rounded-lg md:w-[100px] md:h-[100px]'>
              <img src={cardDetails.image1} alt="" className='w-[100%] h-[100%] rounded-lg' />
              </div>
              <div className='w-[80%] h-[100px]  gap-[5px]  '>
                <h1 className='w-[90%] truncate '>{ `In ${cardDetails.landmark}, ${cardDetails.city}`}</h1>
                <h1>{cardDetails.title}</h1>
                <h1>{cardDetails.category}</h1>
                <h1 className='flex items-center justify-start gap-[5px] '><FaStar className='text-yellow-600'/>
              {cardDetails.ratings}</h1>
              </div>
             
              

            </div>

             <div className='w-[95%] h-[60%] border-[1px] border-[#abaaaa] rounded-lg flex justify-start items-start p-[20px] gap-[15px] flex-col '>
             <h1 className='text-[15px] font-semibold'>Booking Price -</h1>


             <p className='w-[100%] flex justify-between items-center px-[20px]'>
            <span className='font-semibold'>
              {`Rs_${cardDetails.rent} x ${night} Nights`}
            </span>
            <span>{cardDetails.rent*night}</span>

             </p>



            <p className='w-[100%] flex justify-between items-center px-[20px] '>
            <span className='font-semibold'>
            Tax
            </span>
            <span>{cardDetails.rent*7/100}</span>
             </p>





              <p className='w-[100%] flex justify-between items-center px-[20px] border-b-[1px] border-gray-500 pb-[10px]'>
            <span className='font-semibold'>
             Airbnb Charge
            </span>
            <span>{cardDetails.rent*7/100}</span>

             </p>




             <p className='w-[100%] flex justify-between items-center px-[20px] '>
            <span className='font-semibold'>
            Total Price
            </span>
            <span>{total}</span>
             </p>




            


                
              </div>


          </div>



           



          </div>
           }
           
           
           
  </div>
  )
}

export default ViewCard