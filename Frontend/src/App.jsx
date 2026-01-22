import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'

function App() {
  return (
      <>
      {/* //define all your routes here */}
      <Routes>
        {/* // Here we import all the components */}

        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<SignUp/>} />

      </Routes>
      </>
  )
}

export default App

//2:00:00