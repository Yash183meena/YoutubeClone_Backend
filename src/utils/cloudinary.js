import {v2 as cloudinary} from "cloudinary";
import fs from 'fs';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});
const uploadCloudinary=async(localFilePath)=>{
      try{
            if(!localFilePath){
                  return null;
            } 

            const response=await cloudinary.uploader.upload(localFilePath,{
                  resource_type:"auto"
                  //matlab detect kelo jo bhi file aa rhai hai
            })

            //file has been uploaded successfully
            console.log("file has been uploaded successfully!");
            console.log(response.url);

            return response;
      }
      catch(error){
            fs.unlinkSync(localFilePath);
            //this will remove the locally saved temporary file as the upload operation got failed

            return null;
      }
}
