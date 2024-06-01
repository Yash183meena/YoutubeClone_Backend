import mongoose,{Schema} from 'mongoose';

const subscriptionSchema=new Schema({
         subscriber:{
            type:Schema.Types.ObjectId,
            ref:"User" //one to who is subscribing
         },
         channel:{
             type:Schema.Types.ObjectId,
             ref:"User" //one to whom subscriber is 'subscribing'(subscriber ne kis person ke channel ko subscribe kiya)
         }

},{timestamps:true});

export const Subscription=mongoose.model("Subscription",subscriptionSchema);