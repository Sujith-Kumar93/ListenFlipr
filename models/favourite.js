const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favouriteSchema = new Schema({
  rating: {
    type: Number,
    default: 0,
  },
  podcast: {
    type: Schema.Types.ObjectId,
    ref: "Podcast",
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Favourite", favouriteSchema);
