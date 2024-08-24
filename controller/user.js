const User = require("../models/user")

module.exports.signUpRenderForm=(req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signUp=async (req,res)=>{
    try{
       let {email,username,password}=req.body;
       const newUser=new User({email,username})
       const registerUser= await User.register(newUser,password)
       console.log(registerUser)
       req.login(registerUser,(err)=>{
         if(err){
          return next(err)
         }
         req.flash("success","logged you In!");
         res.redirect(("/listing"))
       })
    }   
    catch(e){
       req.flash("error",e.message)
       res.redirect("/signup") }
   }


module.exports.loginRenderForm=async (req,res)=>{
    res.render("users/login.ejs")
}

module.exports.login=async (req,res)=>{
    req.flash("success","welcome back")
    let redirctUrl=res.locals.redirectUrl || "/listing"
    res.redirect(redirctUrl)
    }



module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
      if(err){
       return next(err)
      }
      req.flash("success","logged you out!");
      res.redirect(("/listing"))
    })
  }    