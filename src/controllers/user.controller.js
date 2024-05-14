import {asyncHandler} from "../utils/asyncHandler.js";

//.json({message:"ok"}) ye ek response bjheja hai apn ne 
export const registerUser=asyncHandler(async(req,res)=>{
      return res.status(200).json({
            message:"ok"
      })
})