const Course = require("../Models/CourseModel");
const Category = require("../Models/Category");
const User = require("../Models/UserModel");

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      user: req.session.userID,
    });

    req.flash("success", "Course created");
    res.status(201).redirect("/courses");
  } catch (error) {
    req.flash("error", "Something Happend??? !!");
    res.status(400).redirect("/courses");
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const categorySlug = req.query.categories;
    const category = await Category.findOne({ slug: categorySlug });
    const search = req.query.search;

    let filter = {};

    if (categorySlug) {
      filter = { category: category._id };
    }

    if (search) {
      filter = { name: search };
    }

    if (!categorySlug && !search) {
      (filter.name = ""), (filter.search = null);
    }

    const courses = await Course.find({
      $or: [
        { name: { $regex: ".*" + filter.name + ".*", $options: "i" } },
        { category: filter.category },
      ],
    }).sort("-createdAt").populate("user")
    const categories = await Category.find();

    res.status(200).render("courses", {
      courses,
      categories,
      page_name: "courses",
    });
  } catch (error) {
    res.status(400).json({
      status: "warning xd",
      error,
    });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.session.userID });
    const categories = await Category.find();

    const course = await Course.findOne({ slug: req.params.slug }).populate(
      "user"
    );

    res.status(200).render("course", {
      course,
      page_name: "courses",
      user,
      categories,
    });
  } catch (error) {
    res.status(400).json({
      status: "warning",
      error,
    });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.push({ _id: req.body.course_id });
    await user.save();

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "warning",
      error,
    });
  }
};

exports.releaseCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.pull({ _id: req.body.course_id });
    await user.save();

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "warning",
      error,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    await Course.findOneAndRemove({slug: req.params.slug});
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "warning",
      error,
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate({slug: req.params.slug}, req.body);

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "warning",
      error,
    });
  }
};
