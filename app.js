const dns=require('dns');
dns.setServers(["8.8.8.8" ,"8.8.4.4"])
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
// console.log(process.env.SELECT)

const express=require("express");
const app=express();
const port=8080;
const path=require("path");
const mongoose=require("mongoose");

// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const dbURL=process.env.ATLASDB_URL;



const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js")

const session=require("express-session");
const MongoStore = require('connect-mongo').default;

const store=MongoStore.create({
    mongoUrl:dbURL,
    crypto:({ 
       secret:process.env.SECRET,
    }),
    touchAfter:24*3600
})

store.on("error",(err) => {
    console.log("ERROR IN MONGO SESSION STORE",err)
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const { required } = require("joi");




main()
.then(()=>{
    console.log("connection successfull")
})
.catch((err) => {
    console.log(err)
})

async function main(){
    await mongoose.connect(dbURL);
}



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    res.locals.currUser=req.user;
    next()
})



app.get("/",(req,res)=>{
    res.send("I am root")
})


// app.get("/getUser",async(req,res) => {
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delte-student",
//     })
//     let registerUser=await User.register(fakeUser,"hellowold");
//     res.send(registerUser);
// })



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter)


app.all('/*splice' , (req,res,next) =>{
    next(new ExpressError(404,"This page not found !"))
})

app.use((err,req,res,next) =>{
   let {statuscode=500,message="somethings Went wrongs"} = err;
    res.status(statuscode).render("error.ejs",{err})
    // res.status(statuscode).send(message);
})

app.listen(port,()=>{
    console.log("connected to DB")
})


//mongodb+srv://saurabhsumit022:<db_password>@cluster0.wdqldaz.mongodb.net/?appName=Cluster0;
//mongodb+srv://saurabhsumit022:saurabhsumit022@123@cluster0.wdqldaz.mongodb.net/?appName=Cluster0;
