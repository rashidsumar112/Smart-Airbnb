import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ListPage1 from './pages/ListPage1'
import ListPage2 from './pages/ListPage2'
import ListPage3 from './pages/ListPage3'
import { userDataContext } from './Context/UserContext'
import MyListing from './pages/MyListing'
import ViewCard from './pages/ViewCard'
import MyBooking from './pages/MyBooking'
import Booked from './pages/Booked'
import {ToastContainer,toast} from 'react-toastify'

function App() {
let {userData} = useContext(userDataContext)

  return (
      <>
      <ToastContainer />
      {/* //define all your routes here */}
      <Routes>
        {/* // Here we import all the components */}

        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/listpage1' 
        element={ userData !=null ? <ListPage1/>:<Navigate to={"/login"}/> }/>
         <Route path='/listpage2' 
          element={userData !=null ? <ListPage2/>:<Navigate to={"/"}/>} />
         <Route path='/listpage3' 
         element={userData !=null ? <ListPage3/>:<Navigate to={"/"}/>} />

         <Route path='/mylisting' 
         element={userData !=null ? <MyListing/>:<Navigate to={"/"}/>} />

         <Route path='/viewcard' 
         element={userData !=null ? <ViewCard/>:<Navigate to={"/"}/>} />

         <Route path='/mybooking' 
         element={userData !=null ? <MyBooking/>:<Navigate to={"/"}/>} />
         <Route path='/booked' 
         element={userData !=null ? <Booked/>:<Navigate to={"/"}/>} />

      </Routes>
      </>
  )
}

export default App

//2:15:00