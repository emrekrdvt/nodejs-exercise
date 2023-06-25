const express = require("express");

const pageController = require("../controllers/courseController");
const roleMiddleware = require("../Middlewares/roleMiddleware");
const router = express.Router();

router.route("/").post(roleMiddleware(["Teacher", "Admin"]),pageController.createCourse);
router.route("/").get(pageController.getAllCourses);
router.route("/:slug").get(pageController.getCourse);
router.route("/:slug").delete(pageController.deleteCourse);
router.route("/:slug").put(pageController.updateCourse);
router.route("/enroll").post(pageController.enrollCourse);
router.route("/release").post(pageController.releaseCourse);

module.exports = router;
