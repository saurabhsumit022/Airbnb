const User = require("../models/user.js")
// Index route (signup)
module.exports.renderSignupForm = (req,res) => {
    res.render("users/signup.ejs")
}

// post route (signup)
module.exports.signup = async(req,res) => {
    try{
        const {username,email,password}=req.body;
        const newUser=new User({email,username});
        console.log(req.body)
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err) => {
            if(err){
                return next(err)
            }
            req.flash("success","welcometo wanderlust")
            res.redirect("/listings")
        })
       
    }catch(e){
        req.flash("error", e.message)
        res.redirect("/signup")


    }

}

// Index route (login)
module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs")
}

// post route (login)
module.exports.login =  async(req,res) => {
    // res.send("Welcome in wanderlust ! you got logged in !")
    req.flash("success","Welcome in wanderlust ! you got logged in !")
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}

// logout routes
module.exports.logout=(req,res) => {
    req.logOut((err) => {
        if(err){
            return next(err);
        }
        req.flash("success","logged you out");
        res.redirect("/listings")
    })

}