const express = require("express")
const router = express.Router()
const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")

const listingController=require("../controller/listing.js")

const multer=require("multer")
const {storage}=require("../cloudConfig.js")
const upload=multer({storage})




//show rout
//display list of all record
router.get("/",listingController.index)

//adding new rout
router.get("/new", isLoggedIn,listingController.renderNewForm)
// create route
router.post("/",isLoggedIn,upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing)
)
// router.post("/",upload.single("listing[image]"),(req,res)=>{
//     res.send(req.file)
// })



//show rout
//displaying indiuduale record

router.get("/:id", wrapAsync(listingController.showListing))


//updating the list of record
//edit form route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm)
)

//update route
router.patch("/:id", isLoggedIn, isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing)
)

//deleteing Rout
router.delete("/:id", isLoggedIn, isOwner, listingController.destroyListing)


module.exports = router;