const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js")

const listingSchema=Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        // type:String,
        // default:"https://images.unsplash.com/photo-1773332598501-f8612761781a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8",
        // set:(v) => 
        //     v == "" ? "https://images.unsplash.com/photo-1773332598501-f8612761781a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8" : v

        url:String,
        filename:String
    },
    price:Number,
    country:String,
    location:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})

listingSchema.post("findOneAndDelete",async(listing) => {
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;