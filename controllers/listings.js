const Listing=require("../models/listings")


// Index routes
module.exports.index =async(req,res,next) => {
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings})
};

// New routes
module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs")
};

// show routes
module.exports.showListing = async(req,res,next) => {
    const {id}=req.params;
    const listing = await Listing.findById(id)
    .populate( {
        path:"reviews",
        populate:{
            path:"author"
        }
    })
    .populate("owner");

    if(! listing){
        req.flash("error","listing your requested for don't exits !")
       return res.redirect("/listings")
    }
    console.log(listing)
    res.render("listings/show.ejs",{listing})
}

//create routes
module.exports.createListing = async(req,res,next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.listing)
    newListing.owner=req.user._id;
    newListing.image={url,filename}
    await newListing.save();
    req.flash("success","New listing created !")
    res.redirect("/listings")
}


//Edit rout
module.exports.renderEditForm = async(req,res,next) => {
    const {id}=req.params;
    const listing = await Listing.findById(id);
    if(! listing){
        req.flash("error","listing your requested for don't exits !")
       return res.redirect("/listings")
    }

    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_100,w_100");
    res.render("listings/edit.ejs",{listing,originalImageUrl})
}

// update routes
module.exports.updateListing = async(req,res,next) => {
    const {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }

    req.flash("success","listing Updated !")
    res.redirect(`/listings/${id}`)
}

//delete routes
module.exports.destroyListing = async(req,res,next) => {
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing Deleted !")
    res.redirect("/listings");
}