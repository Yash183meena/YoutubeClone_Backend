import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const userschema=new mongoose.Schema(
      {
            username:{
                  type:String,
                  required:true,
                  unique:true,
                  lowercase:true,
                  trim:true,
                  index:true,//index due to searching
            },
            email:{
                  type:String,
                  required:true,
                  unique:true,
                  lowercase:true,
                  trim:true,
            },
            fullName:{
                  type:String,
                  required:true,
                  trim:true,
                  index:true,
            },
            avatar:{
                  type:String, //cloudanariy url
                  required:true,
            },
            coverImage:{
                  type:String,  //cloudnary url
            },
            watchHistory:[{
                  type:mongoose.Schema.Types.ObjectId,
                  ref:"Video"
            }],
            password:{
                  type:String,
                  required:[true,'password is required'],
            },
            refreshToken:{
                  type:String,
            }
      }
      
      ,{timestamps:true}
);

//apne funtion use kiya hai tou this ko pata hai saare field hook use ko bolte hai
userschema.pre("save",async function(next){
      if(!this.isModified("password")){
            return next();
      }

      this.password=await bcrypt.hash(this.password,10);
      next();
})

//userschema.methods se apn methods add kr skte hai . apne hiab se jitne chaiye utne methods add kr sakte hai apne (userschema ke andar jo method schema me nahi hoe wo add krdo apne hisab se)

//yaha pr password tou plain text password hai aur this.password ek hashed password hai
userschema.methods.isPasswordCorrect=async function(password){
      await bcrypt.compare(password,this.password)
}

userschema.methods.generateAccessToken=function(){
       return jwt.sign(
            //sabse phele payload likha
            {
                  _id:this._id,
                  email:this.email,
                  username:this.username,
                  fullName:this.fullname
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                  expiresIn:process.env.ACCESS_TOKEN_EXPIRY
            }
       )
}

userschema.methods.generateRefreshToken=function(){
      return jwt.sign(
            //sabse phele payload likha
            {
                  _id:this._id,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                  expiresIn:process.env.REFRESH_TOKEN_EXPIRY
            }
       )
};

export const User=mongoose.model("User",userschema);   