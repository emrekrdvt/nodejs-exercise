const express = require("express");
const session = require("express-session");
var flash = require("connect-flash");
const pageRoute = require("./routes/pageRoutes");
const courseRoute = require("./routes/courseRoute");
const categoryRoute = require("./routes/categoryRoute");
const userRoute = require("./routes/userRoute");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.ATLASURL).then(() => console.log("Connected!"));

const app = express();
//Template Engine
app.set("view engine", "ejs");

global.userIN = null;

//MiddleWare

app.use(express.static("public"));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
const MongoStore = require("connect-mongo");
app.use(
  session({
    secret: "my_keyboard_cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.ATLASURL }), // sessionu dbde tuttuk böyle
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

app.use(methodOverride('_method', {
  methods: ['POST', 'GET'],
}))

app.use("*", (req, res, next) => {
  userIN = req.session.userID; // global bir değişken tanımlayıp kullanıcnın girip girmediğine baktık
  next();
});

app.use("/", pageRoute);
app.use("/courses", courseRoute);
app.use("/category", categoryRoute);
app.use("/users", userRoute);

const port = 3030;

app.listen(port, () => {
  console.log(`app started on ${port}`);
});
