

//listings Model file here we create Schema for User
import mongoose from "mongoose";
const listingSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true

    },
    description:{
        type:String,
        required:true
    },
    host:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    
    image1:{
       
        type:String,
        required:true

    },
    image2:{
       
        type:String,
        required:true

    },
    image3:{
       
        type:String,
        required:true

    },
    rent:{
        type:Number,
        required:true
    },
  city:{
    type:String,
    required:true

  },
   landmark:{
    type:String,
    required:true

  },
  category:{
    type:String,
    required:true

  },
  isBooked:{
    type:Boolean,
    default:false
  }

},
{
    //it means mongoose will automatically manage createdAt and updatedAt properties on your documents.
    timestamps:true,})

const Listing= mongoose.model("Listings",listingSchema);
export default Listing;