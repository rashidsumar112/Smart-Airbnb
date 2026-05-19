import React, { useContext, useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BookingDataContext } from '../Context/BookingContext'
import { authDataContext } from '../Context/AuthContext'
import axios from 'axios'
import { userDataContext } from '../Context/UserContext'
import { listDataContext } from '../Context/ListContext'

const Verify = () => {
    const [searchParams] = useSearchParams()
    const success = searchParams.get('success')
    const bookingId = searchParams.get('bookingId')
    const sessionId = searchParams.get('session_id')
    const navigate = useNavigate()
    const { serverURL } = useContext(authDataContext)
    const { setBookingData } = useContext(BookingDataContext)
    const { getCurrentUser } = useContext(userDataContext)
    const { getListing } = useContext(listDataContext)

    const verifyBooking = async () => {
        try {
            const response = await axios.post(
                serverURL + '/api/booking/verify',
                { success, bookingId, session_id: sessionId },
                { withCredentials: true }
            )

            if (response.data.success) {
                setBookingData(response.data.booking)
                localStorage.setItem('latestBooking', JSON.stringify(response.data.booking))
                await getCurrentUser()
                await getListing()
                navigate('/booked')
            } else {
                localStorage.removeItem('latestBooking')
                navigate('/')
            }
        } catch (error) {
            console.log(error)
            localStorage.removeItem('latestBooking')
            navigate('/')
        }
    }

    useEffect(() => {
        verifyBooking()
    }, [])

    return (
        <div className='verify'>
            <div className='spiner'></div>
        </div>
    )
}

export default Verify
