if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Joi = require("joi");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const session = require("express-session");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const { podcastSchema } = require("./schemas.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Podcast = require("./models/podcast");
const { isLoggedIn } = require("./middleware");
const MongoSanitize = require("express-mongo-sanitize");

const MongoDBStore = require("connect-mongo")(session);
const userRoutes = require("./routes/users");
const podcastRoutes = require("./routes/podcast");
const favouriteRoutes = require("./routes/favourite");

const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  MongoSanitize({
    replaceWith: "_",
  })
);

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];

const store = new MongoDBStore({
  url: dbUrl,
  touchAfter: 24 * 60 * 60,
  secret: "thisshouldbeabettersecret",
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
  store,
  name: "session",
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUnintialized: true,
  cookie: {
    httpOnly: true,
    //secure:true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const validatePodcast = (req, res, next) => {
  const { error } = podcastSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(".");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  next();
});

app.use("/", userRoutes);
app.use("/home", podcastRoutes);
app.use("/home/:id", favouriteRoutes);

app.get("/", (req, res) => {
  res.render("podcasts/main");
});

app.get("/admin", isLoggedIn, (req, res) => {
  res.render("podcasts/admin");
});

app.get("/newpodcast", isLoggedIn, (req, res) => {
  res.render("podcasts/newpodcast");
});

app.get("/favourite", isLoggedIn, async (req, res) => {
  const Userfavourites = await Podcast.find({
    users: { $in: [req.user._id] },
  });
  res.render("podcasts/favourites", { Userfavourites });
});

app.delete("/favourite/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await Podcast.findByIdAndUpdate(id, { $pull: { users: req.user._id } });
  req.flash("success", "successfully removed podcast");
  res.redirect("/favourite");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no! something went wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(3100, () => {
  console.log("serving on port 3100");
});
