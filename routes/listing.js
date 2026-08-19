const express=require("express");
const router=express.Router()
const Listing=require("../models/listings.js");
const wrapAsync=require("../utils/wrapAsync.js")
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const { populate } = require("../models/review.js");

const listingController=require("../controllers/listings.js")

const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({storage})




//Index and create routes:-
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));
  

// new routes
router.get("/new",isLoggedIn ,listingController.renderNewForm)


//show , update ,delete routes
router.route("/:id")
 .get(wrapAsync(listingController.showListing))
 .patch(isLoggedIn,isOwner,validateListing,upload.single("listing[image]"), wrapAsync(listingController.updateListing))
 .delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing))


//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))




// Index routes:-

// router.get("/", wrapAsync(listingController.index));


// // new routes
// router.get("/new",isLoggedIn ,listingController.renderNewForm)


// create routes
// router.post("/" , isLoggedIn,validateListing,wrapAsync(listingController.createListing))


// Show routs:-
// router.get("/:id", wrapAsync(listingController.showListing))


// //Edit route
// router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))


// Update route
// router.patch("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing))


// Delete route
// router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing))

module.exports=router;