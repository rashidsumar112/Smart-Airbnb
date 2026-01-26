import express from "express";
import AuthUser from "../middleware/AuthUser.js";
import upload from "../middleware/multer.js";
import { addListing } from "../controllers/ListingController.js";

let listRouter=express.Router()
//here we fields because we upload multiples images
//AuthUser gives userId, and uploads well uploads the images file in multer
listRouter.post("/add",AuthUser,upload.fields([
   {name:"image1",maxCount:1},
   {name:"image2",maxCount:1},
   {name:"image3",maxCount:1}
]),addListing)


export default listRouter