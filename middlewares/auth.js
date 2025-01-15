const jwt = require("jsonwebtoken");
const { unauthorized } = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(unauthorized).send({ message: "Unauthorized" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(unauthorized).send({ message: "Unauthorized" });
    }
    req.user = payload;
    next();
  });
};

module.exports = auth;
