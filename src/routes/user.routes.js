import { Router } from "express";
import {loginUser, logoutUser, refreshAccessToken, registerUser} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();

router.route("/register").post(
      upload.fields([
          {
              name: "avatar",
              maxCount: 1
          }, 
          {
              name: "coverImage",
              maxCount: 1
          }
      ]),
      registerUser
      )

router.route('/login').post(loginUser)

//secured routes verifyJWT middleware can run first gives next() flag after logoutUser runs
router.route("/logout").post(verifyJWT,logoutUser)

//yaha par mene verifyJWT ka middleware use nahi lagaya kyuki hamare user session expired ke baad wese hi hamne hamare refreshAccessToken me check kar liya hai ki refreshtoken hai jo authenticated user ka(check by cookie) wo user ke refreshtoken ke equal hai kya
router.route("/refresh-token").post(refreshAccessToken);



export default router;
