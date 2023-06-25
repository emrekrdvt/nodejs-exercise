const bcrypt = require("bcrypt");
const User = require("../Models/UserModel");
const Category = require("../Models/Category");
const Course = require("../Models/CourseModel");
const { validationResult } = require("express-validator");

var session = require("express-session");

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).redirect("/login");
  } catch (error) {
    const errors = validationResult(req);
    console.log(errors);
    for (let i = 0; i < errors.array().length; i++) {
      req.flash("error", `${errors.array()[i].msg}`);
    }
    res.status(400).redirect("/register");
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      req.flash("error", "Are you sure ? U shoul register maybe");
      res.status(400).redirect("/login");
    }
    const same = await bcrypt.compare(password, user.password);
    if (same) {
      req.session.userID = user._id;
      res.status(200).redirect("/users/dashboard");
    } else {
      req.flash("error", "Your password is not correct :(");
      res.status(400).redirect("/login");
    }
  } catch (error) {
    req.flash("error", "Your password is not correct :(");
    res.status(400).redirect("/login");
  }
};

exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getDashboard = async (req, res) => {
  const user = await User.findOne({ _id: req.session.userID }).populate(
    "courses"
  );
  const categories = await Category.find();
  const courses = await Course.find({ user: req.session.userID });
  const users = await User.find();
  res.status(200).render("dashboard", {
    page_name: "dashboard",
    user,
    categories,
    courses,
    users,
  });
};

exports.getContact = async (req, res) => {
  res.status(200).render("contact", {
    page_name: "contact",
  });
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndRemove({ _id: req.params.id });
    await Course.deleteMany({ user: req.params.id });
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    req.flash("400", "Bir şeyler yanlış gitti  ???");
  }
};
