import React ,{ useContext, useState } from 'react'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { authDataContext } from '../Context/AuthContext';
import axios from 'axios';

function Login() {

  let navigate=useNavigate();
  //this for toggling eye icon for show hide password
  //useState hook to manage the visibility state of the password input field
  let [Show,setShow] = useState(false);
//state variables to store form data
  let [email,setEmail]=useState("");
  let [password,setPassword]=useState("");
// here we use useContext hook to get the server url from AuthContext
  let {serverURL} = useContext(authDataContext)


const handleLogin=async(e)=>{
try{
  //prevent the default form submission behavior
  e.preventDefault();
  //code for login logic will go here
  let result= await axios.post(serverURL+"/api/auth/login",{
    //data to be sent to backend for login
    email,
    password
  },{withCredentials:true})
  console.log("login successful",result)
} 
catch(error){
  console.log("Error during login",error)

} 
}










  return (
    <div className='w-[100vw] h-[100vh] flex items-center justify-center relative bg-[#f0f4f8]'>
      {/* //back button to home page */}
      <div className='w-[50px] h-[50px] bg-red-700 cursor-pointer justify-center absolute top-[10%] left-[20px] rounded-[50%] flex items-center justify-center' onClick={()=>navigate("/")}><IoArrowBackCircle  className='w-[30px] h-[30px] text-[white]' /></div>
            <form action="" className='max-w-[900px] w-[90%] h-[600px] flex items-center justify-center  flex-col  md:items-start gap-[10px]' onSubmit={handleLogin}>
                <h1 className='text-[30px] text-[black]'>Well Come to Smart-Airbnb</h1>

              <div className='w-[90%] flex items-start justify-start flex-col gap-[10px]'>
                <label htmlFor="email" className='text-[20px]'>Email:</label>
                <input type="email" id='email'className='w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px]' required value={email} onChange={(e)=>setEmail(e.target.value)} />
              </div>

              <div className='w-[90%] flex items-start justify-start flex-col gap-[10px] relative '>
                <label htmlFor="password" className='text-[20px]'>Password:</label>
                <input type={ Show? "text" : "password"} id='password'className='w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px]' required value={password} onChange={(e)=>setPassword(e.target.value)} />
                {Show && <FaEye  className='w-[22px] h-[22px] absolute right-[12%] bottom-[10px] cursor-pointer' onClick={()=>setShow(prev=>!prev)} />}
               { !Show && < FaEyeSlash  className='w-[22px] h-[22px] absolute right-[12%] bottom-[10px] cursor-pointer' onClick={()=>setShow(prev=>!prev)}  />}
              </div>

              <button className='px-[50px] py-[10px] bg-blue-600 text-[white] text-[18px] rounded-lg md:px-[100px] mt-[20px]'>Login</button>

             <p className='text-[18px]'> If New User Click Here? <span className='text-[19px] text-[red] cursor-pointer' onClick={()=>navigate("/signup")}>SignUp</span> </p>

            </form>
          
        </div>
  )
}

export default Login