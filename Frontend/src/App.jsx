import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ListPage1 from './pages/ListPage1'

function App() {
  return (
      <>
      {/* //define all your routes here */}
      <Routes>
        {/* // Here we import all the components */}

        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/listPage1' element={<ListPage1/>} />

      </Routes>
      </>
  )
}

export default App

//2:15:00