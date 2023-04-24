const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Podcast = require("../models/podcast");
const { podcastSchema } = require("../schemas.js");
const { isLoggedIn } = require("../middleware");
const Joi = require("joi");

const User = require("../models/user");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({
  storage,
});
const podcasts = require("../controllers/podcast");

const validatePodcast = (req, res, next) => {
  const { error } = podcastSchema.validate(req.body);
  console.log(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(".");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router
  .route("/")
  .get(catchAsync(podcasts.index))
  .post(isLoggedIn, upload.single("video"), validatePodcast, podcasts.new); //

router
  .route("/:id")
  .get(isLoggedIn, catchAsync(podcasts.getPodcast))
  .put(isLoggedIn, upload.single("video"), catchAsync(podcasts.updatePodcast))
  .delete(isLoggedIn, catchAsync(podcasts.deletePodcast));

router.get("/:id/edit", isLoggedIn, catchAsync(podcasts.editPodcasts));

router.post("/search", podcasts.search);

module.exports = router;
