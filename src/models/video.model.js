import mongoose,{Schema} from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate';
const videoschema=new Schema(
      {
           videofile:{
            type:String, //can be obtained from cloudanariy url
            required:true,
           },
           thumbnail:{
             type:String,  //cloudinary url
             required:true,
           },
           title:{
             type:String, 
             required:true,
           },
           description:{
            type:String, 
            required:true,
          },
          duration:{
             type:Number,
             required:true,
          },
          views:{
            type:Number,
            default:0,
          },
          isPublished:{
            type:Boolean,
            default:false,
          },
          owner:{
             type:Schema.Types.ObjectId,
             ref:"User",
          }
      },
      {
            timestamps:true,
      }
)

//from that we can write advance level of queriers inserting middlewares like 
//pre.post i.e dB save hone se phele kya krna hai ,data save hone ke baad kya karna hai etc.
//[aginate package helps us to manage large amout of dataset]
videoschema.plugin(mongooseAggregatePaginate)

export const Video=mongoose.model("Video",videoschema);