const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Podcast = require("../models/podcast");
const { podcastSchema } = require("../schemas.js");
const { isLoggedIn } = require("../middleware");
const Joi = require("joi");
const favourites = require("../controllers/favourite");

router.post("/favourite/:Uid", isLoggedIn, favourites.favourite);

module.exports = router;
