const express = require("express");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejs = require("ejs");

const photoController = require("./controllers/photoController");
const pageController = require("./controllers/pageController");


const app = express();
mongoose.connect(
);

//TEMPLATE ENGINE
app.set("view engine", "ejs");

//MIDDLEWARE
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

app.get("/", photoController.getAllPhotos);
app.put("/photos/:id", photoController.updatePhoto);
app.get("/photos/:id", photoController.getPhoto);
app.post("/photos", photoController.createPhoto);
app.delete("/photos/:id", photoController.deletePhoto);

app.get("/about", pageController.aboutPage);
 app.get("/add", pageController.addPage);
app.get("/photos/edit/:id", pageController.editPage);

const port = 3000;
app.listen(port, () => {
  console.log(`the server was started on port ${port}`);
});
