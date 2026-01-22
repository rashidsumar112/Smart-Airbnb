//here We Performcae uthentication Related Operations Like Login, Register, Logout etc.
import genToken from "../config/token.js";
import User from "../model/userModel.js";
import bcrypt from "bcryptjs";






//this Controller function for user signup
export const signUp = async(req,res)=>{
    try{
    //get data from req body
    let {name,email,password}= req.body;
    //if user already exists
    let existUser=await User.findOne({email
    });


    //show error if user exists
    if(existUser){
       return res.status(400).json({message:"User already exists"}) 
    }


    //here we hash the password before saving to db
    let hashPassword=await bcrypt.hash(password,10);
    // Here we create new user if not exists
    //Here User is from userModel.js
    let user=await User.create({name,email,password:hashPassword});
    //Generate Token for user
    let token = await genToken(user._id);
    //set token in httpOnly cookie 
    res.cookie("token",token,{
        //we use httpOnly cookies for security
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        //sameSite set to strict for security
        sameSite:"strict",
        //maxAge sets the cookie's expiration time
        maxAge:7*24*60*60*1000, //7 days
    })
    //return response to user
   
    return res.status(201).json(user)

   



    
 } catch(error){
    return res.status(500).json({message:`Error in Signup ${error}`});

    }

}






//Controller function for user login
export const login= async(req,res)=>{
    try{
        //get email and password from req body
    
    let {email,password}= req.body;
    //if check user  exists
    let user=await User.findOne({email
    });


    // if user does not exist
    if(!user){
       return res.status(400).json({message:"User is Not exists"}) 
    }
 //compare password with hashed password
    let isMatch= await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({message:"incoorect password"}) 
    }
    
    //Generate Token for user again for login
    let token = await genToken(user._id);
    //set token in httpOnly cookie 
    res.cookie("token",token,{
        //we use httpOnly cookies for security
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        //sameSite set to strict for security
        sameSite:"strict",
        //maxAge sets the cookie's expiration time
        maxAge:7*24*60*60*1000, //7 days
    })
    //return response to user
   
    return res.status(201).json(user)

    }
    catch(error){
     return res.status(500).json({message:`Error in Login ${error}`});
    }
}



//Controller function for user logout
export const logOut= async(req,res)=>{
    try{
        //clear the token cookie to logout user
    res.clearCookie("token")
    return res.status(200).json({message:"Logout Successful"});
    }
    catch(error){
        return res.status(500).json({message:`Error in Logout ${error}`});
    }
}