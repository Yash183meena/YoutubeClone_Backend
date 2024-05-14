const asyncHandler=(requestHandler)=>{
      return (req,res,next)=>{
            Promise.resolve(requestHandler(req,res,next)).catch((error)=>next(error));
      }
}


export {asyncHandler}
// const asyncHandler2=(fn)=> async(req,res,next)=>{
     
//        try{
//            await fn(req,res,next);
//        }
//        catch(error){
//             res.status( res.status || 404).json({
//                   success:false,
//                   message:error.message
//             })
//        }
// }