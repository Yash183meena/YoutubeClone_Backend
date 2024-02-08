import dotenv from 'dotenv'
import ConnectDb from './db/index.js';
// import express from 'express';

// const app=express();

dotenv.config({
      path:'./env'
});

ConnectDb()
.then(()=>{
      app.listen(process.env.PORT || 8000,()=>{
            console.log(`Server is running on port : ${process.env.PORT}`)
      })
})
.catch((error)=>{
      console.log("Connection Failed",error);
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