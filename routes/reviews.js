const express = require("express");
//we have to add mergeparams as we dont have access to the reviews params automatically
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError")
const { reviewSchema } = require("../schemas.js")
const Review = require("../models/review")
const Campsite = require("../models/campsite")
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");
const reviews = require("../controllers/reviews");



router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));


module.exports = router;