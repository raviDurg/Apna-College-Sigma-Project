const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing");
       return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    
    next();
};

// module.exports.isOwner = async( req, res, next) =>{
//     let { id } = req.params;
//     let listing = await Listing.findById();
//     if (!listing.owner.equals(res.local.currUser._id)) {
//         req.flash("error", "you are not the owner of this listing");
//        return res.redirect(`/listings/${id}`);
//     }
//     next();
// }

// this code tacking from chatgpt

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);  // Make sure you're passing `id` here
    
    // If no listing is found
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    
    // Check if the current logged-in user is the owner of the listing
    if (!listing.owner.equals(req.user._id)) {  // Use `req.user._id` to get the current user
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

  module.exports. validateListing = (req, isLoggedIn, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Server-side validation for reviewSchema
module.exports. validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }

    // Check if the logged-in user is the author of the review
    if (!review.author.equals(req.user._id)) {  // Use req.user._id to get the current user
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
};