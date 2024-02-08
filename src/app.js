import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app=express();

app.use(cors({
            origin:process.env.CORS_ORIGIN,
            credentials:true,
}));

//accesting datain the json() format with limit of 16kb:-->jab form se data aa raha hai tab
app.use(express.json({limit:"16kb"}));
//jab url se data ja raha hai
app.use(express.urlencoded({extended:true,limit:"16kb"}));
//kuch folder ko access krne ke liye jaise images,dist
app.use(express.static("public"));

//server se cookies access karne ke liye aur usme crud operation perform krne ke liye
app.use(cookieParser())

export {app}




