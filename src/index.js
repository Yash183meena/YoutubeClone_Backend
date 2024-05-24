import dotenv from 'dotenv'
import ConnectDb from './db/index.js';
import {app} from './app.js'

// const app=express();

//iske liye settings krni padte hai nodemon ke sath jo package.json me hai
dotenv.config({
      path:'./.env'
});

app.get('/api/test',(req,res)=>{
      res.send("My name is yash");
})

ConnectDb()
.then(()=>{
      app.listen(process.env.PORT || 8000,()=>{
            console.log(`Server is running on port : ${process.env.PORT}`)
      })
})
.catch((error)=>{
      console.log("Connection Failed !!!",error);
})














// import express from 'express';
// const app=express();

// //database connection  through IFFEE
// (async()=>{
//       try{
//            await mongoose.connect(`process.env.MONGODB_URI/${DB_NAME}`)

//            app.on("error",(error)=>{
//               console.log("ERRR:",error)
//               throw error
//            })

//            app.listen(process.env.PORT,()=>{
//               console.log(`Connection is establish on the port ${process.env.PORT}`)
//            })
//       }
//       catch(error){
//          console.error("The ERROR ocurred",error);
//          throw error;
//       }
// })()