 if(process.env.NODR_ENV != "production"){
    require('dotenv').config()
 }



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local"); // Corrected to 'passport-local'
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

// Connect to MongoDB
main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
    // await mongoose.connect(dbUrl);     // if you want mongosh atlas
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



const store = MongoStore.create({
    // mongoUrl: dbUrl,                       // if you want mongosh atlas
    mongoUrl: MONGO_URL, 
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () =>{
    console.log("Error in MONGO SESSION STORE", err);
});

// Sessions configuration
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
       expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week from now
       maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
       httpOnly: true,
    },
};



// Use session and flash
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // Corrected to 'User.authenticate()'

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async(req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });
//     let registeredUser = await User.register(fakeUser, "helloWorld");
//     res.send(registeredUser);
// });

// Root route
// app.get("/", (req, res) => {
//     res.send("HI, I am root");
// });


app.use("/listings", listingRouter); // Listings routes
app.use("/listings/:id/reviews", reviewRouter);// Review routes
app.use("/", userRouter);// user routes

// Catch-all for 404 errors
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Error-handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("./error.ejs", { message });
});

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});












