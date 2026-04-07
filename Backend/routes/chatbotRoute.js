import express from "express";
import AuthUser from "../middleware/AuthUser.js";
import { 
  processMessage, 
  getNearbyListings, 
  searchListings, 
  getListingDetails 
} from "../controllers/ChatbotController.js";

const router = express.Router();

// ============================================
// 🤖 CHATBOT ROUTES
// ============================================
// All routes for chatbot functionality
// Used by frontend Chatbot component

// ============================================
// ROUTE 1: PROCESS MESSAGE WITH GEMINI API
// ============================================
// Purpose: User sends message → Gemini processes → Returns intelligent response
// Example: User: "How do I list my property?"
//          Bot: "I'll help you..." (via Gemini)
router.post('/message', AuthUser, processMessage);

// ============================================
// ROUTE 2: GET NEARBY LISTINGS
// ============================================
// Purpose: Detect user location → Find listings near them
// Called when user says: "Show me properties near me"
// Takes either coordinates (lat/long) or city name
router.post('/nearby', AuthUser, getNearbyListings);

// ============================================
// ROUTE 3: SEARCH LISTINGS
// ============================================
// Purpose: Parse user message → Extract location/category → Search database
// Example: "Show me apartments in Lahore under 30000"
//          Extract: city="Lahore", category="apartment", price=30000
router.post('/search', AuthUser, searchListings);

// ============================================
// ROUTE 4: GET LISTING DETAILS
// ============================================
// Purpose: Get full details of specific listing for user
// Used when user wants to book or see more info
router.get('/listing/:listingId', AuthUser, getListingDetails);

export default router;
