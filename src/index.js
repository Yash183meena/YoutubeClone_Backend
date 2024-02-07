import dotenv from 'dotenv'
import ConnectDb from './db/index.js';

dotenv.config({
      path:'./env'
});
ConnectDb();










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