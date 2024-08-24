const express = require("express")
const mongoose = require("mongoose")
const app = express()
const path = require("path")
const Listing = require("./models/listing.js")
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync")
const ExpressError = require("./utils/ExpressError")
const { listingSchema, reviewSchema } = require("./schema.js")
const Review = require("./models/review.js")
const session = require("express-session")
const MangoStore=require("connect-mongo")
const flash=require("connect-flash")

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User = require("./models/user.js")


const listing = require("./routes/listing.js")
const review = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const MongoStore = require("connect-mongo")



app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
app.engine("ejs", ejsmate)
app.use(express.static(path.join(__dirname, "public")));

const dbUrl=process.env.ATLASDB_URL

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION SOTRE",err)
})

main().then((res) => {
    console.log("connection successful")
})
    .catch((err) => {
        console.log(err)
    })

async function main() {
    await mongoose.connect(dbUrl);
}


const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }

};




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    res.locals.currUser=req.user

    next();
})


//listing router
app.use("/listing", listing);


//reviews router
app.use("/listing/:id/reviews", review);

//user router
app.use("/", userRouter);


//middle ware

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"))
})
app.use((err, req, res, next) => {
    let { status = 500, message = "some err occ" } = err
    // res.status(status).send(message);
    res.status(status).render("error.ejs", { message })
})




app.listen(3000, (req, res) => {
    console.log("server stared")
})
