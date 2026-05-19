import express from "express";
import AuthUser from "../middleware/AuthUser.js";
// ✨ NEW: Import the getBookedDates function
import {
  cancleBooking,
  createBooking,
  getBookedDates,
  verifyBooking,
} from "../controllers/BookingController.js";

const bookRouter = express.Router();
//for booking route

bookRouter.post("/create/:id", AuthUser, createBooking);

bookRouter.post("/verify", AuthUser, verifyBooking);

//for booking cancle route

bookRouter.delete("/cancle/:id", AuthUser, cancleBooking);

// ✨ NEW ROUTE: Get all booked dates for a listing
// 📍 Path: GET /api/booking/booked-dates/:id
// 🔹 :id = Listing ID
// 🔐 Public route (no AuthUser required - guests need to see availability)
bookRouter.get("/booked-dates/:id", getBookedDates);

export default bookRouter;
