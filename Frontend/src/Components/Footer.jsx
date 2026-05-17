import React, { useState } from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaWhatsapp, FaEnvelope, FaPhone, FaRocketchat } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Chatbot from './Chatbot'

function Footer() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
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
            <Link
              to='/'
              onClick={() => window.scrollTo(0, 0)}
              className='text-[14px] text-[#bdc3c7] hover:text-[#2ecc71] transition-all duration-300'
            >
              Home
            </Link>
            <Link
              to='/'
              onClick={() => window.scrollTo(0, 0)}
              className='text-[14px] text-[#bdc3c7] hover:text-[#2ecc71] transition-all duration-300'
            >
              Browse Listings
            </Link>
            <Link to='/listpage1' className='text-[14px] text-[#bdc3c7] hover:text-[#2ecc71] transition-all duration-300'>List Your Property</Link>
            <Link to='/mybooking' className='text-[14px] text-[#bdc3c7] hover:text-[#2ecc71] transition-all duration-300'>My Bookings</Link>
            <Link to='/mylisting' className='text-[14px] text-[#bdc3c7] hover:text-[#2ecc71] transition-all duration-300'>My Listings</Link>
          </div>

          {/* Support */}
          <div className='flex flex-col gap-[15px]'>
            <Link to='/support' className='text-[18px] font-bold text-[#3498db] hover:text-[#2ecc71] transition-all duration-300'>Support</Link>
            <Link to='/help-center' className='text-[14px] text-[#bdc3c7] hover:text-[#2ecc71] transition-all duration-300'>Help Center</Link>
            <Link to='/safety-liability' className='text-[14px] text-[#bdc3c7] hover:text-[#2ecc71] transition-all duration-300'>Safety & Liability</Link>
            <Link to='/terms-conditions' className='text-[14px] text-[#bdc3c7] hover:text-[#2ecc71] transition-all duration-300'>Terms & Conditions</Link>
            <Link to='/privacy-policy' className='text-[14px] text-[#bdc3c7] hover:text-[#2ecc71] transition-all duration-300'>Privacy Policy</Link>
            <Link to='/faq' className='text-[14px] text-[#bdc3c7] hover:text-[#2ecc71] transition-all duration-300'>FAQ</Link>
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
            <p>Made with ❤️ by Mazari</p>
          </div>
        </div>
      </div>

      {/* Floating Chat + WhatsApp Buttons */}
      <div className='fixed bottom-[0px] right-[22px] z-[60] flex flex-col items-end gap-[8px] md:bottom-[4px] md:right-[26px]'>
        <div className='relative group flex items-center justify-end'>
          <button
            type='button'
            onClick={() => setIsChatbotOpen(true)}
            className='chat-float-button chat-float-chat bg-[#3498db] text-[white] rounded-full w-[48px] h-[48px] flex items-center justify-center text-[19px] shadow-lg hover:bg-[#2980b9] transition-all duration-300 transform hover:scale-105'
            title='Open chat assistant'
          >
            <FaRocketchat className='chat-float-icon' />
          </button>

          <span className='pointer-events-none absolute right-[58px] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#1f2d3a] px-[12px] py-[6px] text-[12px] font-medium text-white opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 group-hover:right-[62px]'>
            how i can help you
          </span>
        </div>

        <div className='relative group flex items-center justify-end'>
          <a
            href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`}
            target='_blank'
            rel='noopener noreferrer'
            className='chat-float-button chat-float-whatsapp bg-[#2ecc71] text-[white] rounded-full w-[48px] h-[48px] flex items-center justify-center text-[21px] shadow-lg hover:bg-[#27ae60] transition-all duration-300 transform hover:scale-105'
            title='Chat on WhatsApp'
          >
            <FaWhatsapp className='chat-float-icon' />
          </a>

          <span className='pointer-events-none absolute right-[58px] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#1f2d3a] px-[12px] py-[6px] text-[12px] font-medium text-white opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 group-hover:right-[62px]'>
            contact with us
          </span>
        </div>
      </div>

      <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />

      <style>{`
        @keyframes chatFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }

        @keyframes chatPulse {
          0% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.45); }
          70% { box-shadow: 0 0 0 10px rgba(52, 152, 219, 0); }
          100% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0); }
        }

        @keyframes whatsappPulse {
          0% { box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.45); }
          70% { box-shadow: 0 0 0 10px rgba(46, 204, 113, 0); }
          100% { box-shadow: 0 0 0 0 rgba(46, 204, 113, 0); }
        }

        .chat-float-button {
          animation: chatFloat 3.2s ease-in-out infinite;
          will-change: transform, box-shadow;
        }

        .chat-float-chat {
          animation: chatFloat 3.2s ease-in-out infinite, chatPulse 2.8s ease-in-out infinite;
        }

        .chat-float-whatsapp {
          animation: chatFloat 3.2s ease-in-out infinite 0.15s, whatsappPulse 2.8s ease-in-out infinite;
        }

        .chat-float-button:hover .chat-float-icon {
          transform: scale(1.12) rotate(-6deg);
          transition: transform 180ms ease;
        }

        .chat-float-icon {
          transition: transform 180ms ease;
        }
      `}</style>
    </footer>
  )
}

export default Footer
