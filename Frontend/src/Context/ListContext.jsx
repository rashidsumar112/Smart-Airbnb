import axios from 'axios'
import React, { useState,Children, createContext, useContext, useEffect } from 'react'
import { authDataContext } from './AuthContext.jsx'
export const listDataContext =createContext()
import{useNavigate} from "react-router-dom"

function ListContext({children}) {

 let navigate = useNavigate()

 let [title,setTitle] = useState("")
 let [description,setDescription] = useState("")
let [frontEndImage1,setfrontEndImage1] = useState(null)
let [frontEndImage2,setfrontEndImage2] = useState(null)
let [frontEndImage3,setfrontEndImage3] = useState(null)
let [backEndImage1,setbackEndImage1] = useState(null)
let [backEndImage2,setbackEndImage2] = useState(null)
let [backEndImage3,setbackEndImage3] = useState(null)
 let [rent,setRent] = useState("")
let [city,setCity] = useState("")
let [landmark,setLandMark] = useState("")
let[category,setCategory] =useState("")
//this for adding button
let [adding,setAdding]=useState(false)

//this for Get data for home page
//here we pass[] mean there are may be many listing cards
let [getlist,setGetList]=useState([])
let [newgetlist,setnewGetList]=useState([])

let [cardDetails,setCardDetails]=useState(null)

let {serverURL}=useContext(authDataContext)

//form data for all above data

//addings data or proerty listings Context
const handleaddList = async()=>{
  //this for adding button that show ..... while data adding
  setAdding(true)

try{
let formData = new FormData()
formData.append("title",title)
formData.append("image1",backEndImage1)
formData.append("image2",backEndImage2)
formData.append("image3",backEndImage3)
formData.append("description",description)
formData.append("rent",rent)
formData.append("city",city)
formData.append("landmark",landmark)
formData.append("category",category)


let result= await axios.post(serverURL + "/api/listing/add",formData,{withCredentials:true})
setAdding(false)
console.log(result)

navigate("/")
//here we clear form after adding list aand move to home
  setTitle("")
  setDescription("")
  setbackEndImage1(null)
   setbackEndImage2(null)
    setbackEndImage3(null)
    setbackEndImage1(null)
    setbackEndImage2(null)
    setbackEndImage3(null)
    setRent("")
    setCity("")
    setLandMark("")
    setCategory("")
    

    }
    catch(error){
    
        setAdding(false)
        console.log(error)

    }
}

//For Find Listing handle
const handleViewCard= async (id) => {

  try {
    let result = await axios.get(serverURL + `/api/listing/findlistingByid/${id}`,{withCredentials:true})
    
    console.log(result.data)
    setCardDetails(result.data)
    navigate("/viewcard")

  }
  catch(error){
    console.log(error)

  }
}




///Getings listing Property to show that on Home for that Host
const getListing=async ()=>{
  try{
    let result =await axios.get(serverURL + "/api/listing/get",{withCredentials:true})
    setGetList(result.data)
    setnewGetList(result.data)


  }
  catch(error){
    console.log(error)

  }
}
useEffect(()=>{
  getListing()

},[adding])




let value={


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
adding,setAdding,
getlist,setGetList,
getListing,
newgetlist,setnewGetList,
handleViewCard,
cardDetails,setCardDetails



}  







  return (
    <div>
     <listDataContext.Provider value={value}>
        {children}
     </listDataContext.Provider>
    </div>
  )
}

export default ListContext