const express = require("express")
const router = express.Router({ mergeParams: true })

const Listing = require("../models/listing.js")
const Review = require("../models/review.js")
const wrapAsync = require("../utils/wrapAsync.js")
const { validateReview, isLoggedIn ,isReviewAuthor} = require("../middleware.js")
const reviewController  = require("../controller/review.js")





//post rout

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview))

//reviews
//delete rout

router.delete("/:revId",
    isLoggedIn,isReviewAuthor,
    wrapAsync(reviewController.destroyReview))


module.exports = router;