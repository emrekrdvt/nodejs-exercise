const nodemailer = require("nodemailer");
const Course = require("../Models/CourseModel");
const User = require("../Models/UserModel");

exports.getHomePage = async (req, res) => {

  const courses = await Course.find().sort('-createdAt').limit(2);
  const totalCourses = await Course.find().countDocuments();
  const totalStudents = await User.countDocuments({role: 'Student'});
  const totalTeachers =await User.countDocuments({role: 'Teacher'});

  res.status(200).render("index", {
    page_name: "index",
    courses,
    totalCourses,
    totalStudents,
    totalTeachers
  });
};

exports.getAboutPage = (req, res) => {
  res.status(200).render("about", {
    page_name: "about",
  });
};

exports.getRegisterPage = (req, res) => {
  res.status(200).render("register", {
    page_name: "register",
  });
};

exports.getLoginPage = (req, res) => {
  res.status(200).render("login", {
    page_name: "login",
  });
};

exports.getContact = async (req, res) => {
  res.status(200).render("contact", {
    page_name: "contact",
  });
};

exports.sendEmail = async (req, res) => {
  try {
    const outputMessage = `
  <h1>Mail Detail</h1>
  <ul>
  <li>Name: ${req.body.name} </li>
  <li>Name: ${req.body.email} </li>
  </ul>
  <h1>Message</h1>
  <p>${req.body.message}</p>
  `;

    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Smart EDU" <krdvt.emre006@gmail.com>', // sender address
      to: "emrekaradavut42@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      html: outputMessage, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    req.flash("success", "We received your mail succesfully");
    res.status(200).redirect("/contact");
  }
   catch (err) {
    req.flash("error", `Something doesnt work we did :/ ${err}`);
    res.status(400).redirect("/contact");
  }
};
