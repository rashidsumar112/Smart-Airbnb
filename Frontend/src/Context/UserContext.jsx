import React, { createContext ,useContext, useEffect, useState} from 'react'
export const userDataContext= createContext()
import { authDataContext } from './AuthContext';
import axios from "axios"



//here {children} is app.jsx component
function UserContext({children}) {


//use the serverURL from authDataContext
let {serverURL}=useContext(authDataContext)

//state variable to store user data
let [userData,setUserData]=useState(null)


const getCurrentUser= async () => {
    try{
        //this axios call will fetch the current logged in user data from backend
        //here withCredentials:true is used to send cookies along with the request for authentication
       let result= await axios.get("Calling:",serverURL + "/api/user/currentuser", {withCredentials:true}) 
       //set the fetched user data to userData state variable
         setUserData(result.data)

    }catch(error){
        setUserData(null)
        console.log("Error fetching current user data",error)
    }
}
 
//and whenever serverURL changes
//this will ensure that we always have the latest user data
//when pages loads  the getCurrentUser function will be called
useEffect(()=>{
    //call the function to fetch current user data when the component mounts
    //when pages refreshes  the getCurrentUser function will be called
    getCurrentUser()

    //[] means this useEffect will run only once when the page loads
},[])


//value to be provided to all children components like app.jsx
let value={
    userData,
    setUserData
}


  return (
    <div>
  <userDataContext.Provider value={value}>
    {children}
  </userDataContext.Provider>
    </div>
  )
}

export default UserContext