//Db Connection Setting file
import mongoose from "mongoose";
//
const connectDB= async()=>{
    try{
        //mongodb connection
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("DB Connected")
    }
    catch(error){
        console.log(`db error ${error.message}`)
        
    }

}
export default connectDB