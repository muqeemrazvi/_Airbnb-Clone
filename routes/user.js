const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync")
const User = require("../models/user")
const passport = require("passport")

const {isLoggedIn}=require("../middleware.js")
const {saveRedirectUrl}=require("../middleware.js")
const userController = require("../controller/user.js")


router.get("/signup",userController.signUpRenderForm)

router.post("/signup",wrapAsync(userController.signUp)
)


router.get("/login",wrapAsync(userController.loginRenderForm))

router.post("/login",saveRedirectUrl,
  passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
  })  
    ,(userController.login))



router.get("/logout",userController.logout)


module.exports=router;