const { campsiteSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError")
const Campsite = require("./models/campsite")
const { reviewSchema } = require("./schemas.js");
const Review = require("./models/review");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in first");
        return res.redirect("/login");
    }
    next();
}


module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campsite = await Campsite.findById(id);
    if (!campsite.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that");
        return res.redirect(`/campsites/${id}`);
    }
    next();
}


module.exports.validateCampsite = (req, res, next) => {

    const { error } = campsiteSchema.validate(req.body);
    //above we destructured from result as we need just the error portion.
    if (error) {
        //error.details is an array of objects so we have to map over it to extract the message. for each element return the message and join on a comma
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    console.log(error)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}



module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that");
        return res.redirect(`/campsites/${id}`);
    }
    next();
}
