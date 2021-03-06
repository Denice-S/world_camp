const Campsite=require("../models/campsite");
const mpxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geocoder=mpxGeocoding({ accessToken: mapBoxToken });
const { cloudinary }=require("../cloudinary");



module.exports.index=async (req, res) => {
    const campsites=await Campsite.find({})
    res.render("campsites/index", { campsites })
}

module.exports.renderNewForm=(req, res) => {
    res.render("campsites/new");
}

module.exports.createCampsite=async (req, res, next) => {
    const geoData=await geocoder.forwardGeocode({
        query: req.body.campsite.location,
        limit: 1
    }).send();

    const campsite=new Campsite(req.body.campsite);
    campsite.geometry=geoData.body.features[0].geometry;
    campsite.images=req.files.map(f => ({ url: f.path, filename: f.filename }));
    campsite.author=req.user._id;
    await campsite.save();
    console.log(campsite);
    req.flash("success", "Successfully created Campsite!")
    res.redirect(`/campsites/${campsite._id}`)

}

module.exports.showCampsites=async (req, res) => {
    const campsite=await Campsite.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    if (!campsite) {
        req.flash("error", "Cannot find that campsite!")
        return res.redirect("/campsites");
    }
    res.render("campsites/show", { campsite });
}

module.exports.renderEditForm=async (req, res) => {
    const campsite=await Campsite.findById(req.params.id)
    if (!campsite) {
        req.flash("error", "Cannot find that campsite!")
        return res.redirect("/campsites");
    }
    res.render("campsites/edit", { campsite });

}

module.exports.updateCampsite=async (req, res) => {
    const { id }=req.params;
    console.log(req.body);
    const campsite=await Campsite.findByIdAndUpdate(id, { ...req.body.campsite },)
    const imgs=req.files.map(f => ({ url: f.path, filename: f.filename }));
    //the above makes and array and we dont want to push and array into an array(as images is an array) so we take the date above that is saved into the variable and the spread this into the push function below so we are only having the data.
    campsite.images.push(...imgs);
    await campsite.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campsite.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        console.log(campsite);
    }
    req.flash("success", "Successfully Updated")
    res.redirect(`/campsites/${campsite._id}`)


}

module.exports.deleteCampsite=async (req, res) => {
    const { id }=req.params;
    const campsite=await Campsite.findByIdAndDelete(id);
    req.flash("success", "Deleted Campsite")
    res.redirect("/campsites");
}