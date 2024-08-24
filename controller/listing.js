const Listing = require("../models/listing.js")

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

require("dotenv").config()
let mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    let lists = await Listing.find()
    res.render("./listing/index.ejs", { lists }
    )
}

module.exports.renderNewForm = (req, res) => {

    res.render("./listing/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id).populate({
        path: "review",
        populate: {
            path: "author",
        },
    })
        .populate("owner");

    if (!listing) {
        req.flash("error", "listing does not exsist!")
        res.redirect("/listing")
    }

    res.render("./listing/show.ejs", { listing })
}


module.exports.createListing = async (req, res) => {
    let response = await geocodingClient.
        forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        })
        .send()
    console.log(response.body.features[0].geometry)
    //    res.send("done")
    let url = req.file.path;
    let filename = req.file.filename;

    let newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id
    newListing.image = { url, filename }
    newListing.geometry = response.body.features[0].geometry
    let savelisting = await newListing.save();
    console.log(savelisting)

    req.flash("success", "new listing added")
    res.redirect("/listing")
}


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "listing does not exsist")
        res.redirect("/listing")
    }

    // let originalUrl=listing.image.url;
    // console.log(listing)

    //     originalUrl=originalUrl.replace("/upload","/upload/h_300,w_250/e_blur:300")
    //    console.log(originalUrl)
    res.render("./listing/edit.ejs", { listing })
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params
     
    let response = await geocodingClient.
    forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send()
console.log(response.body.features[0].geometry)

req.body.listing.geometry = response.body.features[0].geometry
console.log(req.body.listing)


    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename }
        await listing.save()
    }

    req.flash("success", "listing updated")
    res.redirect(`/listing/${id}`)
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params

    await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted")
    res.redirect("/listing")
}