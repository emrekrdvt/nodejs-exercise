const mongoose = require("mongoose");
const { type } = require("os");
const schema = mongoose.Schema;

const PhotoSchema = new schema({
  title: String,
  description: String,
  image: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const Photo = mongoose.model("Photo", PhotoSchema);

module.exports = Photo;
