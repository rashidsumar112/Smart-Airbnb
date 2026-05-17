import React, { useState, useEffect, useContext, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import { MdSend } from 'react-icons/md';
import { authDataContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../Context/UserContext';
import axios from 'axios';


// CHATBOT COMPONENT - Smart Airbnb Assistant


function Chatbot({ isOpen, onClose }) {

  // STATE MANAGEMENT
 

  // Messages state - stores chat history
  // Each message has: id, text, sender ('user' or 'bot'), timestamp
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hi! I'm your Smart Airbnb Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);

  // User input state - current message being typed
  const [inputValue, setInputValue] = useState('');

  // Loading state - shows typing indicator when bot is responding
  const [isLoading, setIsLoading] = useState(false);

  // Reference for auto-scrolling to latest message
  const messagesEndRef = useRef(null);

  // Get server URL from auth context for API calls
  const { serverURL } = useContext(authDataContext);
  const { userData } = useContext(userDataContext);
  const navigate = useNavigate();

 
  //  CHATBOT LISTINGS STATE (ADDITION)

  // Stores listing cards that chatbot should show in chat panel
  const [listingResults, setListingResults] = useState([]);

 
  // AUTO-SCROLL FUNCTIONALITY
 
  // Automatically scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  
  // SEND MESSAGE HANDLER

  
  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    // Create user message object
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setListingResults([]);

    try {
      // ============================================
      //  FEATURE: DETECT "NEAR ME" INTENT ONLY (ADDITION)
      // ============================================
      // As requested: location detect only when user says near me / nearby
      const lowerMessage = inputValue.toLowerCase();
      const isNearMeIntent =
        lowerMessage.includes('near me') ||
        lowerMessage.includes('nearby') ||
        lowerMessage.includes('around me') ||
        lowerMessage.includes('mere qareeb') ||
        lowerMessage.includes('mere kareeb');

      // ============================================
      //  FEATURE: LOCATION-BASED LISTINGS FLOW (ADDITION)
      // ============================================
      if (isNearMeIntent) {
        // Step 1: Try browser geolocation (free, no Google Maps billing)
        const getPosition = () =>
          new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
              reject(new Error('Geolocation not supported'));
              return;
            }
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 8000,
              maximumAge: 60000,
            });
          });

        let nearbyResponse;

        try {
          const position = await getPosition();
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          nearbyResponse = await axios.post(
            `${serverURL}/api/chatbot/nearby`,
            { latitude, longitude },
            { withCredentials: true }
          );
        } catch (geoError) {
          // If location permission denied/fails, ask user to type city
          const botResponse = {
            id: Date.now(),
            text:
              '📍 Please allow location access for near-me suggestions, or type your city name (e.g., Lahore).',
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, botResponse]);
          setIsLoading(false);
          return;
        }

        const nearbyMessage = {
          id: Date.now() + 1,
          text:
            nearbyResponse?.data?.message ||
            'Here are listings near your location.',
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, nearbyMessage]);
        setListingResults(nearbyResponse?.data?.listings || []);
        setIsLoading(false);
        return;
      }

     
      //  FEATURE: GENERAL GEMINI ASSISTANT FLOW (ADDITION)
      
      // For booking/listing/support messages (host + guest)
      const hasHostListings = Array.isArray(userData?.listing) && userData.listing.length > 0;
      const inferredRole = hasHostListings ? 'host' : 'guest';

      const response = await axios.post(
        `${serverURL}/api/chatbot/message`,
        {
          message: inputValue,
          userRole: inferredRole,
        },
        { withCredentials: true }
      );

      const botResponse = {
        id: Date.now() + 4,
        text:
          response?.data?.message ||
          'I can help with listing, booking, and nearby suggestions.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setListingResults(response?.data?.listings || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: messages.length + 2,
        // ============================================
        //  REQUIRED FALLBACK ERROR MESSAGE (ADDITION)
        // ============================================
        text: 'Unable to fetch data right now. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  // ============================================
  // KEYBOARD HANDLER
  // ============================================
  // Send message on Enter key (Shift+Enter for new line)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ============================================
  // RENDER - Don't show if not open
  // ============================================
  if (!isOpen) return null;

  // ============================================
  //  NAVIGATION HANDLER FOR BOOK BUTTON (ADDITION)
  // ============================================
  // Redirect user to listing detail page where Reserve flow already exists
  const handleReserveFromChat = async (listingId) => {
    try {
      const listingRes = await axios.get(
        `${serverURL}/api/listing/findlistingByid/${listingId}`,
        { withCredentials: true }
      );

      // Save listing data the same way existing app expects before /viewcard
      localStorage.setItem('chatbotSelectedListing', JSON.stringify(listingRes.data));
      navigate('/viewcard');
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 9,
        text: 'Unable to open listing right now. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  // ============================================
  //  AUTHENTICATION CHECK - Only logged-in users
  // ============================================
  // If user is not logged in, show login prompt
  if (!userData) {
    return (
      <div className="fixed bottom-20 right-6 z-[50] md:bottom-24 md:right-8">
        <div className="w-[90vw] max-w-[450px] bg-white rounded-3xl shadow-2xl overflow-hidden animate-slideUp border-2 border-[#aee884]/20">
          <div className="bg-gradient-to-r from-[#aee884] via-[#9fd66e] to-[#8fd966] px-6 py-5 flex items-center justify-between shadow-md">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">🏠 Smart Airbnb</h2>
              <p className="text-xs text-gray-700 mt-1">Your Personal Assistant</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/40 rounded-full transition duration-200 hover:scale-110"
            >
              <IoClose className="w-6 h-6 text-gray-900 font-bold" />
            </button>
          </div>
          <div className="p-6 text-center">
            <p className="text-gray-700 mb-4">Please log in to access the chatbot assistant.</p>
            <button
              onClick={() => {
                onClose();
                navigate('/login');
              }}
              className="w-full bg-[#aee884] hover:bg-[#98d56f] text-gray-900 font-semibold py-2 px-4 rounded-lg transition"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // JSX STRUCTURE - Beautiful Chat Interface
  // ============================================
  return (
    // ============================================
    // OUTER CONTAINER - Fixed position, bottom-right
    
    <div className="fixed bottom-20 right-6 z-[50] md:bottom-24 md:right-8">

      {/* 
        ============================================
        MAIN CHAT WINDOW - Beautiful Card Design
        ============================================
       
      */}
      <div className="w-[90vw] max-w-[450px] h-[65vh] max-h-[580px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slideUp border-2 border-[#aee884]/20">

        {/* 
          ============================================
          HEADER SECTION - Green Gradient
      
        */}
        <div className="bg-gradient-to-r from-[#aee884] via-[#9fd66e] to-[#8fd966] px-6 py-5 flex items-center justify-between shadow-md">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">🏠 Smart Airbnb</h2>
            <p className="text-xs text-gray-700 mt-1">Your Personal Assistant</p>
          </div>
          {/* 
           
          */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/40 rounded-full transition duration-200 hover:scale-110"
          >
            <IoClose className="w-6 h-6 text-gray-900 font-bold" />
          </button>
        </div>

        {/* 
          ============================================
          MESSAGES AREA - Chat Display
         
        */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
          {messages.map((message) => (
            // ============================================
            // INDIVIDUAL MESSAGE BUBBLE
            // ============================================
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInMessage`}
            >
              <div
                className={`max-w-xs px-5 py-3 rounded-2xl ${message.sender === 'user'
                    // USER MESSAGE STYLING:
                   
                    ? 'bg-gradient-to-r from-[#aee884] to-[#9fd66e] text-gray-900 rounded-br-none shadow-md font-medium'
                    // BOT MESSAGE STYLING:
                  
                    : 'bg-white text-gray-800 border-2 border-[#aee884]/30 rounded-bl-none shadow-sm'
                  }`}
              >
                <p className="text-sm md:text-base leading-relaxed">{message.text}</p>
                {/* 
                 
                */}
                <span className="text-xs text-gray-600 mt-2 block opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {/* 
            ============================================
            LOADING INDICATOR - Bouncing Dots
            ============================================
           
          */}
          {isLoading && (
            <div className="flex justify-start animate-fadeInMessage">
              <div className="bg-white text-gray-800 border-2 border-[#aee884]/30 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm">
                <div className="flex space-x-3">
                  <div className="w-3 h-3 bg-[#aee884] rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-[#aee884] rounded-full animate-bounce delay-100"></div>
                  <div className="w-3 h-3 bg-[#aee884] rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}

          {/* Auto-scroll reference point */}
          <div ref={messagesEndRef} />

          {/* 
            ============================================
             LISTING CARDS INSIDE CHAT (ADDITION)
            ============================================
          
          */}
          {listingResults.length > 0 && (
            <div className="space-y-3 mt-2">
              {listingResults.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white border-2 border-[#aee884]/30 rounded-xl p-3 shadow-sm"
                >
                  <img
                    src={listing.images?.[0]}
                    alt={listing.title}
                    className="w-full h-28 object-cover rounded-lg mb-2"
                  />
                  <h4 className="font-semibold text-gray-900 text-sm">{listing.title}</h4>
                  <p className="text-xs text-gray-600">
                    {listing.landmark}, {listing.city}
                  </p>
                  <p className="text-sm font-bold text-green-700 mt-1">
                    Rs. {listing.rent} / day
                  </p>

                  {/* 
                    ============================================
                    🆕 RESERVE BUTTON FROM CHAT (ADDITION)
                    ============================================
                 
                  */}
                  <button
                    onClick={() => handleReserveFromChat(listing.id)}
                    className="mt-2 w-full bg-[#aee884] hover:bg-[#98d56f] text-gray-900 font-semibold py-2 rounded-lg transition"
                  >
                    Reserve
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 
          ============================================
          INPUT AREA - Message Composer
          ============================================
         
        */}
        <div className="border-t-2 border-[#aee884]/20 p-5 bg-gradient-to-b from-white to-gray-50 shadow-lg">
          <div className="flex gap-3 items-center">
           
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-5 py-3 border-2 border-[#aee884]/30 rounded-full outline-none focus:border-[#aee884] focus:ring-3 focus:ring-[#aee884]/20 transition text-gray-800 placeholder-gray-500 bg-white"
            />

           
            <button
              onClick={handleSendMessage}
              disabled={inputValue.trim() === '' || isLoading}
              className="bg-gradient-to-r from-[#aee884] to-[#9fd66e] hover:from-[#9fd66e] hover:to-[#8fd966] disabled:from-gray-300 disabled:to-gray-300 text-gray-900 font-bold p-3 rounded-full transition transform hover:scale-110 active:scale-95 duration-200 flex items-center justify-center shadow-md"
            >
              <MdSend className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 
        ============================================
        CUSTOM ANIMATIONS & STYLES
        ============================================
      
      */}
      <style>{`
        /* 
          SLIDE-UP ANIMATION
          - Used for chat window entrance
          - Slides up from bottom while fading in
          - Duration: 0.4s ease-out (smooth deceleration)
        */
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* 
          FADE-IN MESSAGE ANIMATION
          - Used for each message appearing
          - Gentle scale transformation (grows from 95% to 100%)
          - Duration: 0.3s ease-out
        */
        @keyframes fadeInMessage {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Apply slide-up to chat window */
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }

        /* Apply fade-in to each message */
        .animate-fadeInMessage {
          animation: fadeInMessage 0.3s ease-out;
        }

        /* 
          ANIMATION DELAYS
          - Creates wave effect for loading dots
          - Each dot bounces slightly later than the previous
        */
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
}

export default Chatbot;
