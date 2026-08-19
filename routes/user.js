const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js")

//Index And  post routes (for signup)
router.route("/signup")
 .get(userController.renderSignupForm)
 .post(wrapAsync(userController.signup))


//Index And  post route (for login)
router.route("/login")
 .get(userController.renderLoginForm)
 .post(saveRedirectUrl, passport.authenticate('local', { 
     failureRedirect: '/login',
     failureFlash:true
    }),
   userController.login

 );


// logOut route
router.get("/logout",userController.logout)



// Index route (signup)
// router.get("/signup",userController.renderSignupForm);


// post route (signup)
// router.post("/signup",wrapAsync(userController.signup))


//Index route (for login)
// router.get("/login",userController.renderLoginForm)


// post route (for login)
// router.post("/login",saveRedirectUrl, passport.authenticate('local', { 
//     failureRedirect: '/login',
//     failureFlash:true
//  }),
//  userController.login

// )


// // logOut route
// router.get("/logout",userController.logout)

module.exports=router;