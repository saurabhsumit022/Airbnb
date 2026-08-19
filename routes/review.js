const express=require("express");
const router=express.Router({mergeParams:true})
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js")
const Review=require("../models/review.js");
const Listing=require("../models/listings.js");

const reviewController=require("../controllers/reviews.js")


//reviews (post routes)
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview))

// reviews (Delete  routes)
router.delete("/:reviewId",isLoggedIn ,isReviewAuthor, wrapAsync(reviewController.destoryReview)) 

module.exports=router;