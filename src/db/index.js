import mongoose from 'mongoose';

import { DB_NAME } from '../constants.js';

const ConnectDb=async()=>{
      try{
      const ConnectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
      console.log(`MongoDB connected : Connection Host ${ConnectionInstance.connection.host}`);
      
      }
      catch(error){
            console.log("MongoDb Connection Failed",error);
            process.exit(1);
      }
}

export default ConnectDb;