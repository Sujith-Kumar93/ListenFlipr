const Podcast = require("../models/podcast");

module.exports.favourite = async (req, res) => {
  const { id, Uid } = req.params;

  const podcast = await Podcast.findById(id);
  await podcast.users.push(Uid);
  await podcast.save();
  /* founduser.fav.push(podId); */
  /* req.flash("success", "Marked as favourite");
  res.redirect(`/home/${podId}`); */
  res.redirect("/home");
};
