import express from "express";
import AuthUser from "../middleware/AuthUser.js";
import upload from "../middleware/multer.js";
import { addListing, deleteListing, findListing, getList, updateListing } from "../controllers/ListingController.js";

let listRouter=express.Router()
//here we fields because we upload multiples images
//AuthUser gives userId, and uploads well uploads the images file in multer
listRouter.post("/add",AuthUser,upload.fields([
   {name:"image1",maxCount:1},
   {name:"image2",maxCount:1},
   {name:"image3",maxCount:1}
]),addListing)


//getlist Route
listRouter.get("/get",getList)
//findList Route
listRouter.get("/findlistingbyid/:id",AuthUser,findListing)

//for deletion
listRouter.delete("/delete/:id",AuthUser,deleteListing)

//for Update Route
listRouter.post("/update/:id",AuthUser,upload.fields([
   {name:"image1",maxCount:1},
   {name:"image2",maxCount:1},
   {name:"image3",maxCount:1}
]),updateListing)


export default listRouter