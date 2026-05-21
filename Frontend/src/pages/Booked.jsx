import React, { useContext, useEffect, useMemo, useState } from 'react'
import { GiConfirmed } from 'react-icons/gi'
import { useNavigate } from 'react-router-dom'
import { BookingDataContext } from '../Context/BookingContext'
import Start from '../Components/Start'
import axios from 'axios'
import { authDataContext } from '../Context/AuthContext'
import { toast } from 'react-toastify'

function Booked() {
    const { bookingData, setBookingData } = useContext(BookingDataContext)
    const navigate = useNavigate()
    const { serverURL } = useContext(authDataContext)
    const [star, setStar] = useState(null)

    const storedBooking = useMemo(() => {
        const raw = localStorage.getItem('latestBooking')
        if (!raw) {
            return null
        }

        try {
            return JSON.parse(raw)
        } catch (error) {
            return null
        }
    }, [])

    const currentBooking = bookingData || storedBooking

    useEffect(() => {
        if (!bookingData && storedBooking) {
            setBookingData(storedBooking)
        }
    }, [bookingData, setBookingData, storedBooking])

    if (!currentBooking) {
        return (
            <div className='flex min-h-[100vh] w-[100vw] items-center justify-center bg-slate-100 text-[20px] font-semibold text-slate-700'>
                Loading booking confirmation...
            </div>
        )
    }

    const handleStar = (value) => {
        setStar(value)
    }

    const handleRating = async () => {
        try {
            if (!star) {
                toast.error('Please select a rating first')
                return
            }

            const listingId = currentBooking?.listing?._id || currentBooking?.listing

            const result = await axios.post(
                serverURL + `/api/listing/ratings/${listingId}`,
                { ratings: star },
                { withCredentials: true }
            )

            console.log(result.data)
            localStorage.removeItem('latestBooking')
            setBookingData(null)
            toast.success('Thanks for your rating')
            navigate('/')
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Rating failed')
        }
    }

    return (
        <div className='flex min-h-[100vh] w-[100vw] flex-col items-center justify-center gap-[10px] bg-gradient-to-br from-slate-100 via-slate-50 to-sky-100 px-4 pt-[10px] text-slate-800'>
            <div className='w-[95%] max-w-[500px] min-h-[300px] rounded-[28px] border border-white/70 bg-white/80 p-[20px] shadow-[0_20px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl md:w-[80%]'>
                <div className='flex w-[100%] flex-col items-center justify-center gap-[20px] text-[20px] font-semibold'>
                    <GiConfirmed className='h-[80px] w-[100px] text-emerald-500' />
                    Booking Confirmed
                </div>

                <div className='w-[100%] flex items-center justify-between text-[16px] md:text-[18px] gap-[14px]'>
                    <span>Booking Id:</span>
                    <span className='text-right break-all'>{currentBooking._id}</span>
                </div>

                <div className='w-[100%] flex items-center justify-between text-[16px] md:text-[18px] gap-[14px]'>
                    <span>Owner Details:</span>
                    <span className='text-right break-all'>{currentBooking.host?.email}</span>
                </div>

                <div className='w-[100%] flex items-center justify-between text-[16px] md:text-[18px] gap-[14px]'>
                    <span>Total Rent:</span>
                    <span>Rs. {currentBooking.totalRent?.toFixed ? currentBooking.totalRent.toFixed(2) : currentBooking.totalRent}</span>
                </div>
            </div>

            <div className='w-[95%] max-w-[600px] min-h-[200px] rounded-[28px] border border-white/70 bg-white/80 p-[20px] shadow-[0_20px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl md:w-[80%]'>
                <h1 className='text-[18px]'> {star || 0} Out of 5 Rating</h1>
                <Start onRate={handleStar} />
                <button className='mt-[20px] rounded-full bg-slate-900 px-[50px] py-[10px] text-[18px] text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800 md:px-[100px]' onClick={handleRating}>Submit</button>
            </div>

            <button className='absolute left-[10px] top-[10px] rounded-full bg-rose-600 px-[20px] py-[10px] text-[18px] text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-700' onClick={() => navigate('/')}>Back to Home</button>
        </div>
    )
}

export default Booked
