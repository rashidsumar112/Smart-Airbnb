import express from "express";
import AuthUser from "../middleware/AuthUser.js";
import { 
  processMessage, 
  getNearbyListings, 
  searchListings, 
  getListingDetails 
} from "../controllers/ChatbotController.js";

const router = express.Router();


//  CHATBOT ROUTES




// ROUTE 1: PROCESS MESSAGE WITH GEMINI API


router.post('/message', AuthUser, processMessage);


// ROUTE 2: GET NEARBY LISTINGS


router.post('/nearby', AuthUser, getNearbyListings);


// ROUTE 3: SEARCH LISTINGS


router.post('/search', AuthUser, searchListings);


// ROUTE 4: GET LISTING DETAILS


router.get('/listing/:listingId', AuthUser, getListingDetails);

export default router;
