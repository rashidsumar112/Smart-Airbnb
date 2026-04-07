import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaWhatsapp, FaEnvelope, FaPhone } from 'react-icons/fa'

function Footer() {
  const whatsappNumber = '03246701992'
  const email = 'rashidsumar681@gmail.com'
  const phoneNumber = '+92 324 6701992'

  return (
    <footer className='w-[100%] bg-gradient-to-br from-[#2c3e50] to-[#1a252f] text-[#ecf0f1] mt-[50px] rounded-tl-[50px] rounded-tr-[50px]'>
      {/* Top Section - Contact & Quick Links */}
      <div className='max-w-[1400px] mx-auto px-[20px] py-[50px]'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-[40px] mb-[40px]'>
          
          {/* Company Info */}
          <div className='flex flex-col gap-[15px]'>
            <h3 className='text-[24px] font-bold text-[#3498db]'>Smart Airbnb</h3>
            <p className='text-[14px] text-[#bdc3c7] leading-relaxed'>
              Your trusted platform for finding and listing beautiful accommodations worldwide.
            </p>
            <div className='flex gap-[15px] text-[20px]'>
              <a href='#' className='text-[#3498db] hover:text-[#2ecc71] transition-all duration-300 transform hover:scale-110'>
                <FaFacebook />
              </a>
              <a href='#' className='text-[#3498db] hover:text-[#2ecc71] transition-all duration-300 transform hover:scale-110'>
                <FaTwitter />
              </a>
              <a href='#' className='text-[#3498db] hover:text-[#2ecc71] transition-all duration-300 transform hover:scale-110'>
                <FaInstagram />
              </a>
              <a href='#' className='text-[#3498db] hover:text-[#2ecc71] transition-all duration-300 transform hover:scale-110'>
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className='flex flex-col gap-[15px]'>
            <h4 className='text-[18px] font-bold text-[#3498db]'>Quick Links</h4>
            <a href='/' className='text-[14px] text-[#bdc3c7] hover:text-[#2ecc71] transition-all duration-300'>Home</a>
            <a href='#' className='text-[14px] text-[#bdc3c7] hover:text-[#2ecc71] transition-all duration-300'>Browse Listings</a>
            <a href='#' className='text-[14px] text-[#bdc3c7] hover:text-[#2ecc71] transition-all duration-300'>List Your Property</a>
            <a href='#' className='text-[14px] text-[#bdc3c7] hover:text-[#2ecc71] transition-all duration-300'>My Bookings</a>
            <a href='#' className='text-[14px] text-[#bdc3c7] hover:text-[#2ecc71] transition-all duration-300'>My Listings</a>
          </div>

          {/* Support */}
          <div className='flex flex-col gap-[15px]'>
            <h4 className='text-[18px] font-bold text-[#3498db]'>Support</h4>
            <a href='#' className='text-[14px] text-[#bdc3c7] hover:text-[#2ecc71] transition-all duration-300'>Help Center</a>
            <a href='#' className='text-[14px] text-[#bdc3c7] hover:text-[#2ecc71] transition-all duration-300'>Safety & Liability</a>
            <a href='#' className='text-[14px] text-[#bdc3c7] hover:text-[#2ecc71] transition-all duration-300'>Terms & Conditions</a>
            <a href='#' className='text-[14px] text-[#bdc3c7] hover:text-[#2ecc71] transition-all duration-300'>Privacy Policy</a>
            <a href='#' className='text-[14px] text-[#bdc3c7] hover:text-[#2ecc71] transition-all duration-300'>FAQ</a>
          </div>

          {/* Contact Info */}
          <div className='flex flex-col gap-[15px]'>
            <h4 className='text-[18px] font-bold text-[#3498db]'>Contact Us</h4>
            
            {/* WhatsApp */}
            <a 
              href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-[10px] text-[14px] text-[#bdc3c7] hover:text-[#2ecc71] transition-all duration-300 group'
            >
              <FaWhatsapp className='text-[18px] group-hover:scale-125 transition-transform' />
              <span>{whatsappNumber}</span>
            </a>

            {/* Email */}
            <a 
              href={`mailto:${email}`}
              className='flex items-center gap-[10px] text-[14px] text-[#bdc3c7] hover:text-[#2ecc71] transition-all duration-300 group'
            >
              <FaEnvelope className='text-[18px] group-hover:scale-125 transition-transform' />
              <span>{email}</span>
            </a>

            {/* Phone */}
            <a 
              href={`tel:${phoneNumber}`}
              className='flex items-center gap-[10px] text-[14px] text-[#bdc3c7] hover:text-[#2ecc71] transition-all duration-300 group'
            >
              <FaPhone className='text-[18px] group-hover:scale-125 transition-transform' />
              <span>{phoneNumber}</span>
            </a>
          </div>
        </div>

       

        {/* Bottom Section */}
        <div className='flex flex-col sm:flex-row justify-between items-center gap-[20px] text-[12px] text-[#95a5a6]'>
          <div>
            <p>&copy; 2024 Smart Airbnb. All rights reserved.</p>
          </div>
          <div className='flex gap-[20px]'>
            <a href='#' className='hover:text-[#2ecc71] transition-all duration-300'>Terms of Service</a>
            <a href='#' className='hover:text-[#2ecc71] transition-all duration-300'>Privacy Policy</a>
            <a href='#' className='hover:text-[#2ecc71] transition-all duration-300'>Cookies Policy</a>
          </div>
          <div>
            <p>Made with ❤️ by Smart Airbnb Team</p>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`}
        target='_blank'
        rel='noopener noreferrer'
        className='fixed bottom-[30px] right-[30px] bg-[#2ecc71] text-[white] rounded-full w-[60px] h-[60px] flex items-center justify-center text-[30px] shadow-lg hover:bg-[#27ae60] transition-all duration-300 transform hover:scale-110 z-[50]'
        title='Chat on WhatsApp'
      >
        <FaWhatsapp />
      </a>
    </footer>
  )
}

export default Footer
