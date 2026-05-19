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
            <div className='w-[100vw] min-h-[100vh] flex items-center justify-center bg-slate-300 text-[20px] font-semibold'>
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
        <div className='w-[100vw] min-h-[100vh] flex items-center justify-center gap-[10px] pt-[10px] bg-slate-300 flex-col'>
            <div className='w-[95%] max-w-[500px] min-h-[300px] bg-[#aee884] flex items-center justify-center border-[1px] border-[#b5b5b5] flex-col gap-[18px] p-[20px] md:w-[80%] rounded-lg'>
                <div className='w-[100%] text-[20px] flex items-center justify-center flex-col gap-[20px] font-semibold'>
                    <GiConfirmed className='w-[100px] h-[80px]' />
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

            <div className='w-[95%] max-w-[600px] min-h-[200px] bg-[#aee884] flex items-center justify-center border-[1px] border-[#b5b5b5] flex-col gap-[10px] p-[20px] md:w-[80%] rounded-lg'>
                <h1 className='text-[18px]'> {star || 0} Out of 5 Rating</h1>
                <Start onRate={handleStar} />
                <button className='px-[50px] py-[10px] bg-blue-600 text-[white] text-[18px] rounded-lg md:px-[100px] mt-[20px]' onClick={handleRating}>Submit</button>
            </div>

            <button className='py-[10px] bg-red-600 text-[white] text-[18px] rounded-lg md:px-[20px] mt-[10px] absolute top-[10px] left-[10px]' onClick={() => navigate('/')}>Back to Home</button>
        </div>
    )
}

export default Booked
