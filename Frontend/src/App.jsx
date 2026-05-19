import React, { useContext, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
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
import Verify from './pages/Verify'
import { ToastContainer, toast } from 'react-toastify'
import Footer from './Components/Footer'
import Support from './pages/Support'
import HelpCenter from './pages/HelpCenter'
import SafetyLiability from './pages/SafetyLiability'
import TermsConditions from './pages/TermsConditions'
import PrivacyPolicy from './pages/PrivacyPolicy'
import FAQ from './pages/FAQ'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  let { userData } = useContext(userDataContext)

  return (
    <>
      <ScrollToTop />
      <ToastContainer />
      {/* //define all your routes here */}
      <Routes>
        {/* // Here we import all the components */}

        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/listpage1'
          element={userData != null ? <ListPage1 /> : <Navigate to={"/login"} />} />
        <Route path='/listpage2'
          element={userData != null ? <ListPage2 /> : <Navigate to={"/"} />} />
        <Route path='/listpage3'
          element={userData != null ? <ListPage3 /> : <Navigate to={"/"} />} />

        <Route path='/mylisting'
          element={userData != null ? <MyListing /> : <Navigate to={"/"} />} />

        <Route path='/viewcard'
          element={userData != null ? <ViewCard /> : <Navigate to={"/"} />} />

        <Route path='/mybooking'
          element={userData != null ? <MyBooking /> : <Navigate to={"/"} />} />
        <Route path='/booked'
          element={<Booked />} />

        <Route path='/verify'
          element={<Verify />} />

        <Route path='/support' element={<Support />} />
        <Route path='/help-center' element={<HelpCenter />} />
        <Route path='/safety-liability' element={<SafetyLiability />} />
        <Route path='/terms-conditions' element={<TermsConditions />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/faq' element={<FAQ />} />

      </Routes>

      {/* ✨✨✨ BEAUTIFUL FOOTER COMPONENT ✨✨✨ */}
      <Footer />
    </>
  )
}

export default App

//2:15:00