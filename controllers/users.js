const User = require("../models/user");
const { invalidData, notFound, serverError } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res.status(serverError).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(invalidData).send({ message: err.message });
      }
      return res.status(serverError).send({ message: err.message });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new Error("Not Found"))
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.message === "Not Found") {
        return res.status(notFound).send({ message: "User not found" });
      }
      return res.status(serverError).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUser };
