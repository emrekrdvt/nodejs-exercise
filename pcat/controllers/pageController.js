const Photo = require("../Models/Photo");

exports.addPage = (req, res) => {
  res.render("add");
};

exports.editPage = async (req, res) => {
  const photoID = req.params.id;
  const photo = await Photo.findOne({ _id: photoID });
  res.render("edit", {
    photo,
  });
};

exports.aboutPage = (req, res) => {
  res.render("about");
};
