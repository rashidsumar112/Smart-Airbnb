

import express from "express"
import AuthUser from "../middleware/AuthUser.js"
import { cancleBooking, createBooking } from "../controllers/BookingController.js"

const bookRouter = express.Router()
//for booking route

bookRouter.post("/create/:id", AuthUser, createBooking)

//for booking cancle route

bookRouter.delete("/cancle/:id", AuthUser, cancleBooking)

export default bookRouter
