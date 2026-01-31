import { v2 as cloudinary } from 'cloudinary';
//it takes images file and unlink that images
import fs from "fs"

const uploadOnCloudinary =  async (filepath)=>{
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_SECRET_KEY
    });
    try{
        if(!filepath){
            return null
        }
        //store file on cloudinary
        const uploadResult= await cloudinary.uploader.upload(filepath)
        //remove file here
        fs.unlinkSync(filepath)
        //return urls from uploads
        return uploadResult.secure_url


    }
    catch(error){
        try{
            fs.unlinkSync(filepath)
        }
        catch(unlinkError){}
        console.log(`Cloudinary upload error:`, error)
        return null
    }
}

export default uploadOnCloudinary