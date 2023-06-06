const Photo = require("../Models/Photo");
const fs = require("fs");

exports.getAllPhotos = async (req, res) => {
  const page = req.query.page || 1;
  const photosPerPage = 3;

  const totalPhotos = await Photo.find().countDocuments();

  const photos = await Photo.find({})
    .sort("-dateCreated")
    .skip((page - 1) * photosPerPage)
    .limit(photosPerPage);

  res.render("index", {
    photos: photos,
    current: page,
    pages: Math.ceil(totalPhotos / photosPerPage),
  });
  /* const photos = await Photo.find({}).sort("date");
  res.render("index", {
    photos,
  }); */
};

exports.getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render("photo", {
    photo,
  });
};

exports.createPhoto = (req, res) => {
  const uploadDir = __dirname + "/../public/uploads";

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadedImg = req.files.image;
  let uploadPath = __dirname + "/../public/uploads/" + uploadedImg.name;

  uploadedImg.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: "/uploads/" + uploadedImg.name,
    });
    await res.redirect("/");
  });
};

exports.updatePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  await photo.save();

  res.redirect(`/photos/${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findById({ _id: req.params.id });
  let deleteImg = __dirname + "/../public" + photo.image;
  fs.unlinkSync(deleteImg);
  await Photo.findByIdAndRemove({ _id: req.params.id });

  res.redirect("/");
};
