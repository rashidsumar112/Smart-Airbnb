import express from 'express';
import AuthUser from '../middleware/AuthUser.js';
import { getCurrentUser } from '../controllers/UserController.js';

let userRouter= express.Router();
//first argument is route path second is middleware third is controller function
//path compltete  http://localhost:8000/api/user/currentUser
userRouter.get("/currentuser",AuthUser,getCurrentUser)


export default userRouter;