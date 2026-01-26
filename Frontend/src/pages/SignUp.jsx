//Here we make signup page for user registration

import React ,{ useContext, useState } from 'react'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authDataContext } from '../Context/AuthContext';
import { userDataContext } from '../Context/UserContext';

function SignUp() {
//to navigate to different routes after signup like for login
  let navigate=useNavigate();
//this for toggling eye icon for show hide password
let [Show,setShow] = useState(false);
//hHere we use useContext hook to get the server url from AuthContext
let {serverURL}=useContext(authDataContext)
//state variables to store form data 
let [name,setName]=useState("");
let [email,setEmail]=useState("");
let [password,setPassword]=useState("");

////Here we set Data to SignUp Data
 let {userData,setUserData}=useContext(userDataContext);



//here we create the handleSignup function to handle the signup logic like form validation api call etc
const handleSignUp=async(e)=>{
try{
  //prevent the default form submission behavior
  e.preventDefault();
  //code for signup logic will go here
  let result= await axios.post(serverURL+"/api/auth/signup",{
    //data to be sent to backend for signup
    name,
    email,
    password
  },{withCredentials:true})
  //set the fetched user data to userData state variable
  setUserData(result.data);
  navigate("/");
  console.log("Signup successful",result)
} 
catch(error){
  console.log("Error during signup",error)

} 
}







  return (
    <div className='w-[100vw] h-[100vh] flex items-center justify-center relative bg-[#f0f4f8]'>
   {/* //back button to home page */}
      <div className='w-[50px] h-[50px] bg-red-700 cursor-pointer justify-center absolute top-[5%] left-[20px] rounded-[50%] flex items-center justify-center' onClick={()=>navigate("/")}><IoArrowBackCircle  className='w-[30px] h-[30px] text-[white]'/></div>
        <form action="" className='max-w-[900px] w-[90%] h-[600px] flex items-center justify-center  flex-col  md:items-start gap-[10px]' onSubmit={handleSignUp}>
            <h1 className='text-[30px] text-[black]'>Well Come to Smart-Airbnb</h1>
            <div className='w-[90%] flex items-start justify-start flex-col gap-[10px] mt-[30px]'>

            <label htmlFor="name" className='text-[20px]'>Username:</label>
            <input type="text" id='name'className='w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px]' required onChange={(e)=>setName(e.target.value)} value={name} />
          </div>

          <div className='w-[90%] flex items-start justify-start flex-col gap-[10px]'>
            <label htmlFor="email" className='text-[20px]'>Email:</label>
            <input type="email" id='email'className='w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px]' required onChange={(e)=>setEmail(e.target.value)} value={email} />
          </div>

          <div className='w-[90%] flex items-start justify-start flex-col gap-[10px] relative '>
            <label htmlFor="password" className='text-[20px]'>Password:</label>
            <input type={ Show? "text" : "password"} id='password'className='w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px]' required onChange={(e)=>setPassword(e.target.value)} value={password}/>

            {Show && <FaEye  className='w-[22px] h-[22px] absolute right-[12%] bottom-[10px] cursor-pointer' onClick={()=>setShow(prev=>!prev)} />}
           { !Show && < FaEyeSlash  className='w-[22px] h-[22px] absolute right-[12%] bottom-[10px] cursor-pointer' onClick={()=>setShow(prev=>!prev)}  />}
          </div>

          <button className='px-[50px] py-[10px] bg-blue-600 text-[white] text-[18px] rounded-lg md:px-[100px] mt-[20px]'>Sign Up</button>

        <p className='text-[18px]'>Already have Account? <span className='text-[19px] text-[red] cursor-pointer' onClick={()=>navigate("/login")}>Login</span> </p>

        </form>
      
    </div>
  )
}

export default SignUp