const express = require("express");
const mongoose = require("mongoose");
const podcasts = require("./examplePodcasts");
const path = require("path");
const Podcast = require("../models/podcast");

mongoose.connect("mongodb://0.0.0.0:27017/listen", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

const app = express();

const seedDB = async () => {
  await Podcast.deleteMany({});
  for (let i = 0; i < 12; i++) {
    const pod = new Podcast({
      name: `${podcasts[i].name}`,
      description: `${podcasts[i].description}`,
      speaker: `${podcasts[i].speaker}`,
      category: `${podcasts[i].category}`,
      image:
        "https://images.unsplash.com/photo-1677706642929-05d79a166298?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTh8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    });
    await pod.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
