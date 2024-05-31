import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens=async(userId)=>{

      try{
         const user=await User.findOne(userId);
         const accessToken=user.generateAccessToken();
         const refreshToken=user.generateRefreshToken();

         user.refreshToken=refreshToken;
         user.save({validateBeforeSave:false});
          
         return {accessToken,refreshToken};
      }
      catch(error){
             throw new ApiError(500,"Something went wrong while generating refresh and access token");
      }
}

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


export const loginUser=asyncHandler(async(req,res)=>{
        
      const {email,username,password}=req.body;
      
      if(!username && !email){
            throw new ApiError(400,"username or password is required");
      }

      const user = await User.findOne({
            //these are the operators of mongoDb
            $or:[{username},{email}]
      });

      //agar user mila hi nahi
      if(!user){
            throw new ApiError(404,"user does not exist");
      }

      const isPasswordValid = await user.isPasswordCorrect(password);

      if(!isPasswordValid){
            throw new ApiError(401,"invalid user credentials!");
      }

      const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id);

      //user ke andar abhi refresh token nahi hai. kyuki refreshtoken lene ke call uske line 131 me maare hai user phele hi le liya gya hai line 115 pr

       const loggedinUser=await User.findById(user._id).select("-password -refreshToken");

       const options={
            httpOnly:true,
            secure:true
       }

       return res
       .status(200)
       .cookie("accessToken",accessToken,options)
       .cookie("refreshToken",refreshToken,options)
       .json(
            new ApiResponse(
                  200,
                  {
                        user:loggedinUser,accessToken,refreshToken
                  },
                  "User logged In Successfully"
            )
       )

})

export const logoutUser=asyncHandler(async(req,res)=>{
         await User.findByIdAndUpdate(
            // In MongoDB, the $set operator is used to update the value of a field in a document. If the field does not exist, $set will create it. This operator is useful for both modifying existing fields and adding new fields to documents
            req.user._id,{
                  $set:{
                        refreshToken:undefined
                  }
            },
            {
                  new:true
            }
         )

         const options={
            httpOnly:true,
            secure:true
         }

          return res
          .status(200)
          .clearCookie("accessToken",options)
          .clearCookie("refreshToken",options)
          .json(new ApiResponse(200,{},"User logged Out"))

})

export const refreshAccessToken=asyncHandler(async(req,res)=>{
      const incomingRefreshToken=req.cokkies.refreshToken || req.body.refreshToken;
      
      if(incomingRefreshToken){
            throw new ApiError(401,"unauthorized request");
      }

      try {
            const decodedToken=jwt.verify(
                  incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET
            )
      
            //database dusare continent me hota hai isliye await ka use kro
            const user=await findById(decodedToken?._id);
      
            if(!user){
                  throw new ApiError(401,"invalid refresh token");
            }
      
            if(incomingRefreshToken!==user?.refreshToken){
                 throw new ApiError(401,"Refresh token is expired");
            }
      
            const options={
                  htppOnly:true,
                  secure:true
            }
      
            const {accessToken,newRefreshToken}=await generateAccessAndRefreshTokens(user._id);
          
            return res
              .status(200)
              .cookie("accessToken",accessToken,options)
              .cookie("refreshToken",newRefreshToken,options)
              .json(
                  new ApiResponse(
                        200,
                        {accessToken,refreshToken:newRefreshToken},
                        "Access token refreshed"
                  )
              )
      } catch (error) {
            throw new ApiError(401,error?.message || "Invalid refresh token");
      }
})