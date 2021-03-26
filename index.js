if (process.env.NODE_ENV!=="production") {
    require("dotenv").config();
}


const express=require("express");
const path=require("path");
const mongoose=require("mongoose");
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError")
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const passportLocalMongoose=require("passport-local-mongoose");
const User=require("./models/user");
const authRoutes=require("./routes/auth");
const campsiteRoutes=require("./routes/campsites");
const reviewsRoutes=require("./routes/reviews");
const helmet=require('helmet');
const mongoSanitize=require('express-mongo-sanitize');
const dbUrl=process.env.DB_URL||"mongodb://localhost:27017/worldCamp";

const MongoStore=require("connect-mongo");



//ocal server is =mongoose.connect("mongodb://localhost:27017/worldCamp"

// mongoose.connect(dbUrl,
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).catch(error => handleError(error));

const db=mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});


const app=express();
//app.use wwill run or be avaliable for every single route
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize({
    replaceWith: '_'
}))

const secret=process.env.SECRET||"squirrel"

const store=MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24*60*60,
    crypto: {
        secret,
    }
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})
//cookies ****order is important here**** so this section must go here before the routers.
const sessionConfig={
    //for security change the cookie name to something else...other than session_id
    store,
    name: "options",
    secret: "simplesimon",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        //date.now is in milliseconds so we have to add up to get to seconds,minutes,hours and days to get 1 week expiration!
        expires: Date.now()+1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,

    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());
const scriptSrcUrls=[
    // "https://stackpath.bootstrapcdn.com/",
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css',
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls=[
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css',
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls=[
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls=[];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/sprocket/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//how to serialize a user-how to store a user in the "session"
passport.serializeUser(User.serializeUser());
//how do you get a user out of the session
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser=req.user;
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();

});

//prefixing routes
app.use("/", authRoutes);
//set the route handlers using router so all routes  start with campsites
app.use("/campsites", campsiteRoutes);
//set the router so all review routes are prefixed with /campites/:id/reviews automatically so in our routes we dont need to specify this
app.use("/campsites/:id/reviews", reviewsRoutes);




app.get("/", (req, res) => {
    res.render("home");
})

//for every request use router.all and * to match any path because this us at the end this will only run if none of the above routes are matched. This should always go at the end
app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found ", 404))

})

//error handler
app.use((err, req, res, next) => {
    const { statusCode=500, }=err;
    if (!err.message) err.message="Something went wrong"
    res.status(statusCode).render("error", { err })

})

app.listen(3000, () => {
    console.log("Server started on port 3000")
});