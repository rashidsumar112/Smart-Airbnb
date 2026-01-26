import axios from 'axios'
import React, { useState,Children, createContext, useContext } from 'react'
import { authDataContext } from './AuthContext.jsx'
export const listDataContext =createContext()

function ListContext({children}) {

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

let {serverURL}=useContext(authDataContext)

//form data for all above data


const handleaddList = async()=>{
    try{
let formData = new formData()
formData.append("title",title)
formData.append("image1",backEndImage1)
formData.append("image2",backEndImage2)
formData.append("image3",backEndImage3)
formData.append("description",description)
formData.append("rent",rent)
formData.append("city",city)
formData.append("landmark",landmark)
formData.append("category",category)


let result= await axios.post(serverURL+ "/api/listing/add",formData,{withCredentials:true})
console.log(result)

    }
    catch(error){

        console.log(error)

    }
}



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
handleaddList



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