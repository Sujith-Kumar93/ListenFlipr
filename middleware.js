const ExpressError = require("./utils/ExpressError");
const Podcast = require("./models/podcast");

module.exports.isAdmin = (req, res, next) => {
  if (req.user._id == process.env.ADMIN_ID) {
    next();
  } else {
    req.flash("error", "only admin can access");
    res.redirect("/home");
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "you must be signed in first");
    return res.redirect("/login");
  }
  next();
};
