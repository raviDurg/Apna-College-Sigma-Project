const express = require("express");
const router = express.Router({ mergeParams: true }); // Allows access to params from parent route
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn,isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// Server-side validation for reviewSchema  its shift in middelewere
// const validateReview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);

//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// };

// Reviews - Post Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Reviews - Delete Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;
