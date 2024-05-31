//This middleware indicated that wheather the user logged in or not

import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

//res kaam nahi aa rha tou uske jagah _ kar do
export const verifyJWT=asyncHandler(async(req,_,next)=>{
      try {
            const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","");
      
            if(!token){
                  throw new ApiError(401,"Unauthorized request");
            }
      
           const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
      
           const user=await User.findById(decodedToken?._id).select("-password -refreshToken");
      
           if(!user){
            throw new ApiError(401,"Invalid Access Token");
           }
      
           //req ek andar ek naya user object add kr diya
           req.user=user;
           next()
      } catch (error) {
            throw new ApiError(401,error?.message || "Invalid access token")
      }
})