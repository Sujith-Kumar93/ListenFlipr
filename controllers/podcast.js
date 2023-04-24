const Podcast = require("../models/podcast");

module.exports.index = async (req, res) => {
  const podcasts = await Podcast.find({});
  if (!podcasts) {
    req.flash("error", "No podcasts found");
  }
  res.render("home", { podcasts });
};

module.exports.new = async (req, res) => {
  const podcast = new Podcast(req.body.podcast);
  podcast.video = {
    url: req.file.path,
    filename: req.file.filename,
  };
  await podcast.save();
  if (!podcast) {
    req.flash("error", "there is a problem creating podcast");
    return res.redirect("/home/admin");
  }
  console.log(podcast);
  res.redirect(`/home/${podcast._id}`);
};

module.exports.getPodcast = async (req, res) => {
  const pod = await Podcast.findById(req.params.id);
  if (!pod) {
    req.flash("error", "cannot find that podcast");
    return res.redirect("/home");
  }
  res.render("podcasts/show", { pod });
};

module.exports.editPodcasts = async (req, res) => {
  const podcast = await Podcast.findById(req.params.id);
  if (!podcast) {
    req.flash("error", "cannot find that podcast");
    return res.redirect("/home");
  }
  res.render("podcasts/edit", { podcast });
};

module.exports.updatePodcast = async (req, res) => {
  const { id } = req.params;
  const podcast = await Podcast.findByIdAndUpdate(id, {
    ...req.body.podcast,
  });
  if (!podcast) {
    req.flash("error", "cannot find that podcast");
    return res.redirect("/home");
  }
  req.flash("success", "successfully edited the podcast");

  res.redirect(`/home/${podcast._id}`);
};

module.exports.deletePodcast = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    req.flash("error", "cannot delete the podcast");
    res.redirect("/home");
  }
  await Podcast.findByIdAndDelete(id);

  req.flash("success", "successfully deleted the podcast");

  res.redirect("/home");
};

module.exports.search = async (req, res) => {
  const { name } = req.body;
  const podcast = await Podcast.findOne({ name: name });
  if (!podcast) {
    req.flash("error", "cannot find that podcast");
    return res.redirect("/home");
  }
  res.redirect(`/home/${podcast._id}`);
};
