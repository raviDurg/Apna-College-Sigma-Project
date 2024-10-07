const Listing = require("../models/listing")

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});

    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm =(req, res) => {
    res.render("listings/new.ejs");
}


module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path:"reviews",
         populate: {
            path:"author",
          },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};


// module.exports.createListing =  async (req, res) => {
//     const { title, description, price, location, country, image } = req.body.listing;

//     // Set a default image URL if none is provided
//     const defaultImageUrl = "https://th.bing.com/th/id/OIP.qRJFBjNjwd6WeVwwgkcDDgHaE7?w=306&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7";
//      let url = req.file.path;
//      let filename = req.file.filename;
     
//     const newListing = new Listing({
//         title,
//         description,
//         price,
//         location,
//         country,
//         image: {
//             filename: 'defaultimage',
//             url: image?.url || defaultImageUrl  
//         },
//         owner: req.user._id
//     });

//     newListing.owner = req.user._id;
//     newListing.image = (url, filename);

//     await newListing.save();
//     req.flash("success", "New Listing Created!");
//     res.redirect("/listings");
// };

// module.exports.createListing = async (req, res) => {
//     const { title, description, price, location, country } = req.body.listing;

//     // Set a default image URL if none is provided
//     const defaultImageUrl = "https://th.bing.com/th/id/OIP.qRJFBjNjwd6WeVwwgkcDDgHaE7?w=306&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7";

//     // Handle uploaded image from multer/cloudinary
//     let url = req.file ? req.file.path : defaultImageUrl;
//     let filename = req.file ? req.file.filename : "defaultimage";

//     // Create new listing with provided data and the uploaded image or default image
//     const newListing = new Listing({
//         title,
//         description,
//         price,
//         location,
//         country,
//         image: {
//             filename: filename,
//             url: url
//         },
//         owner: req.user._id
//     });

//     await newListing.save();
//     req.flash("success", "New Listing Created!");
//     res.redirect("/listings");
// };


module.exports.createListing = async (req, res) => {
    const { title, description, price, location, country } = req.body.listing;

    // Change: Default image URL if no file uploaded
    const defaultImageUrl = "https://th.bing.com/th/id/OIP.qRJFBjNjwd6WeVwwgkcDDgHaE7?w=306&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7";

    // Change: Use uploaded file from multer or fallback to default
    let url = req.file ? req.file.path : defaultImageUrl;
    let filename = req.file ? req.file.filename : "defaultimage";

    // Creating the new listing
    const newListing = new Listing({
        title,
        description,
        price,
        location,
        country,
        image: {
            filename: filename,
            url: url
        },
        owner: req.user._id
    });

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};





module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('owner');
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload","/upload/h_300,w_250");
    // if (!listing.owner.equals(req.user._id)) {
    //     req.flash("error", "You do not have permission to edit this listing!"); // Flash error message
    //     return res.redirect(`/listings/${id}`);  // Redirect to the listing show page
    // }
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}



// module.exports.updateListing = async (req, res) => {
//     const { id } = req.params;
//     const { title, description, price, location, country, image } = req.body.listing;
    
//    let listing =  await Listing.findByIdAndUpdate(id, {
//         title,
//         description,
//         price,
//         location,
//         country,
//         image: {
//             filename: 'listingimage',
//             url: image.url
//         },
//         owner: req.user._id
//     });
//     if(typeof req.file != "undefined"){
//     let url = req.file.path;
//     let filename = req.file.filename;
//     listing.image = {url,filename};
//     await listing.save();
// }
//     req.flash("success", " Review Updated!");
//     res.redirect(`/listings/${id}`);
// };

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const { title, description, price, location, country } = req.body.listing;
    
    // Find the listing to update
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    // Change: Updating listing fields
    listing.title = title;
    listing.description = description;
    listing.price = price;
    listing.location = location;
    listing.country = country;

    // Change: Handling updated image if a new file is uploaded
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }

    // Save updated listing
    await listing.save();
    
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};



module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}