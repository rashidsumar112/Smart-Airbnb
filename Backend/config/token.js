//Token configuration file (token which Retrun by Db to user)
import jwt from "jsonwebtoken";

const genToken =async(userId)=>{
    try{
        //Generate token using jwt sign method
        let token = await jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"7d"});
        return token;
    } catch(error){
        console.log("Error in generating token",error);
    }
}
export default genToken;