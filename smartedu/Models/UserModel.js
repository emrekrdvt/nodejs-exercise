const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Student", "Teacher", "Admin"],
    default: "student",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

/* UserSchema.pre("save", function (next) {
  const user = this;
  bcrypt.hash(user.password, 10, (err, hashed) => {
    user.password = hashed;
    next();
  });
}); */

UserSchema.pre("save", function (next) {
  const user = this;
  if(!user.isModified('password')) return next();
  
  bcrypt.hash(user.password, 10, (err, hashed) => {
    user.password = hashed;
    next();
  });
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
