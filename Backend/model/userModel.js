//User Model file here we create Schema for User
import mongoose from "mongoose";
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true

    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    //User also make listing of his property that Ref from the Listing Model
    listing:[{
        //Reference to Listing Model
        type:mongoose.Schema.Types.ObjectId,
        ref:"Listing"

    }],
    booking:[{
        //Reference to Booking Model
        type:mongoose.Schema.Types.ObjectId,
        ref:"Booking"
    }]
},
{
    //it means mongoose will automatically manage createdAt and updatedAt properties on your documents.
    timestamps:true,})

const User= mongoose.model("User",userSchema);
export default User;