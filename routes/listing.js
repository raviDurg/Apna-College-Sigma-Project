const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const { index } = require("../controllers/listings.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });



router
.route("/")
.get(wrapAsync(listingController.index)) // Index route - shows all listings
.post(isLoggedIn,
    //  validateListing,
     upload.single('listing[image]'),     //  muter process for image listing
      wrapAsync(listingController.createListing)
    ); // Create route - add new listing to database



    // New route - form for creating new listing
router.get("/new", isLoggedIn,listingController.renderNewForm);

router
.route("/:id")
.get( wrapAsync(listingController.showListing))// New route - form for creating new listing
.put( isLoggedIn,isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing)) // Update route - update an existing listing
.delete( isLoggedIn,isOwner, wrapAsync(listingController.deleteListing)); // Delete route - delete a listing


// Edit route - form for editing an existing listing
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;  // Corrected from module.export to module.exports
