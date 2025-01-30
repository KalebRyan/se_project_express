const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  invalidData,
  notFound,
  serverError,
  clashError,
  unauthorized,
} = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        const error = new Error("This email is already registered");
        error.name = "MongoError";
        error.code = 11000;
        throw error;
      }

      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((newUser) => {
      res.send({
        name: newUser.name,
        email: newUser.email,
        _id: newUser._id,
        avatar: newUser.avatar,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(invalidData).send({ message: "Invalid ID" });
      }
      if (err.name === "MongoError" && err.code === 11000) {
        return res
          .status(clashError)
          .send({ message: "This email is already registered" });
      }
      return res
        .status(serverError)
        .send({ message: "An error has occurred on the server" });
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(new Error("Not Found"))
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.message === "Not Found") {
        return res.status(notFound).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid ID" });
      }
      return res
        .status(serverError)
        .send({ message: "An error has occurred on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(invalidData)
      .send({ message: "Invalid email or password" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email address or password") {
        return res
          .status(unauthorized)
          .send({ message: "Invalid email or password" });
      }
      return res
        .status(serverError)
        .send({ message: "An error has occurred on the server" });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(new Error("Not Found"))
    .then((user) => res.send({ name: user.name, avatar: user.avatar }))
    .catch((err) => {
      console.error(err);
      if (err.message === "Not Found") {
        return res.status(notFound).send({ message: "User not found" });
      }
      if (err.name === "ValidationError") {
        return res.status(invalidData).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid ID" });
      }
      return res
        .status(serverError)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { createUser, getCurrentUser, login, updateUser };
