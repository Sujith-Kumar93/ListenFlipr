const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Favourite = require("./favourite");
const { number } = require("joi");

const VideoSchema = new Schema({
  url: String,
  filename: String,
});

const PodcastSchema = new Schema({
  name: String,
  description: String,
  speaker: String,
  category: String,
  type: String,
  video: {
    url: String,
    filename: String,
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Podcast", PodcastSchema);
