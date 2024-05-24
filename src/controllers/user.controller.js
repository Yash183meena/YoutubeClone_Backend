import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js";

//.json({message:"ok"}) ye ek response bjheja hai apn ne 
export const registerUser=asyncHandler(async(req,res)=>{
      //get user details from frontend if not take from postman
      //validation (not field should be empty)
      //check if user already exists:username,email
      //check for images,check for avatar
      //upload them to cloudinary,avatar
      //create user object -create entry in db
      //remove password and refresh token field from response(password sending in the response is not a good pratice in industry level)
      //check for user already exixts
      //return response

      const {fullName,email,username,password}=req.body
      console.log("email:",email);

      if(
            [fullName,email,username,password].some((field)=> field?.trim()==="")
      ){
           throw new ApiError(400,"fullName is required");
      } 

      //moongoose directly interact with the mongodb
      const existedUser=await User.findOne({
            $or:[{username},{email}]
      });

      if(existedUser){
            throw new ApiError(409,"User with email or username already exists");
      }
      
      //console.log(req.files)

      //req.files can be provided by the multer
      const avatarLocalPath=req.files?.avatar[0]?.path;
      
      //const coverImageLocalPath=req.files?.coverImage[0]?.path;

      let coverImageLocalPath;

      if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
            coverImageLocalPath=req.files.coverImage[0].path;
      }

      if(!avatarLocalPath){
            throw new ApiError(400,"Avatar file is required");
      }

      const avatar=await uploadOnCloudinary(avatarLocalPath);
      const coverImage=await uploadOnCloudinary(coverImageLocalPath);

      if(!avatar){
            throw new ApiError(400,"Avatar file is required");
      }

      //database hamesha dusare continent me hota hai thats why yaha pr await laga rahe haikyu ki uuse baat krne me time tou lagaga hi
      const user=await User.create({
            fullName,
            avatar:avatar.url,
            coverImage:coverImage?.url || "",
            email,
            password,
            username:username.toLowerCase()
            //mongo db me lowerCase me hi save kiya hai username ko
      })
 
      //select method me by default saare hi field select hote hai isliye - lgakar wo likhte hai jo select nahi karne hai
      const createdUser=await User.findById(user._id).select(
            "-password -refreshToken"
      )

      if(!createdUser){
            throw new ApiError(500,"Something went wrong while registering the user");
      }

      //return res.status(201).json(createdUser)
      //but apn ne ApiResponse bna rkha hai response bhejene ke liye

      return res.status(201).json(
            new ApiResponse(200,createdUser,"User registered Successfully")
      )
})