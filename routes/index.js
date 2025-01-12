const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItems");
const { notFound } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");

router.use("/users", userRouter);
router.use("/items", clothingItem);
router.post("/signin", login);
router.post("/signup", createUser);

router.use((req, res) => {
  res.status(notFound).send({ message: "Not found" });
});

module.exports = router;
