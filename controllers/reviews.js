const Review = require("../models/review");
const Campsite = require("../models/campsite");


module.exports.createReview = async (req, res) => {
    const campsite = await Campsite.findById(req.params.id);
    const review = new Review(req.body.review)
    review.author = req.user._id
    campsite.reviews.push(review);
    await review.save();
    await campsite.save();
    req.flash("success", "Successfully created review")
    res.redirect(`/campsites/${campsite._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    //find the campsite by id and pull(remove) from the reviews array(reviews is an arrray if id's on the campsite) the review that matches the review id
    await Campsite.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted")
    res.redirect(`/campsites/${id}`);

}