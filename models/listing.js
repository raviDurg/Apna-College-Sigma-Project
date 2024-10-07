const mongoose =require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required:true,
    
    },
    description: String,
    
    // image: {
    //     type: String,
    //     default:
    //         "https://unsplash.com/photos/a-waterfall-in-the-middle-of-a-lush-green-forest-J6Fdqeb0Vcs",
    //     set: (v) =>
    //          v === "" 
    //     ? "https://unsplash.com/photos/a-waterfall-in-the-middle-of-a-lush-green-forest-J6Fdqeb0Vcs" 
    //     : v,
    // },
    // image: {
    //     filename: {
    //         type: String,
    //         default: "listingimage",
    //     },
    //     url: {
    //         type: String,
    //         default: "https://unsplash.com/photos/a-waterfall-in-the-middle-of-a-lush-green-forest-J6Fdqeb0Vcs",
    //         set: (v) =>
    //             v === "" ? "https://unsplash.com/photos/a-waterfall-in-the-middle-of-a-lush-green-forest-J6Fdqeb0Vcs" :
    //             v,
    //     }
    // },
    image: {
        url: { type: String, required: true },
        filename: { type: String, required: true },
       },
   
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

// this code for deleting all reviws from database
listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
    await Review.deleteMany({_id: { $in: listing.reviews}});
}
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;