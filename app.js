const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "67214c36c9701d602ecffcd5",
  };
  next();
});
app.use("/", mainRouter);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    // console.log("Connected to the database");
  })
  .catch(console.error);

app.listen(PORT, () => {
  // console.log(`Server is listening on port ${PORT}`);
});
