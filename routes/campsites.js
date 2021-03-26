const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError")
const Campsite = require("../models/campsite")
const { campsiteSchema } = require("../schemas.js");
const { isLoggedIn, isAuthor, validateCampsite } = require("../middleware");
const campsites = require("../controllers/campsites");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.route("/")
    .get(catchAsync(campsites.index))
    .post(isLoggedIn, upload.array("image"), validateCampsite, catchAsync(campsites.createCampsite));


router.get("/new", isLoggedIn, campsites.renderNewForm);

router.route("/:id")
    .get(catchAsync(campsites.showCampsites))
    .put(isLoggedIn, isAuthor, upload.array("image"), validateCampsite, catchAsync(campsites.updateCampsite))
    .delete(isLoggedIn, isAuthor, catchAsync(campsites.deleteCampsite));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campsites.renderEditForm));

module.exports = router;