const Listing = require("../models/listing.js")
const Review = require("../models/review.js")

module.exports.createReview=async (req, res) => {


    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
    newReview.author = req.user._id;
    console.log(newReview)
    listing.review.push(newReview)

    await newReview.save()
    await listing.save()
    req.flash("success", "new Review added")
    res.redirect(`/listing/${listing._id}`)
}


module.exports.destroyReview=async (req, res) => {
    let { id, revId } = req.params;
  
    await Listing.findByIdAndUpdate(id, { $pull: { review: revId } })
    await Review.findByIdAndDelete(revId)
    req.flash("success", " review deleted")
    res.redirect(`/listing/${id}`)
}