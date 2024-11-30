const ClothingItem = require("../models/clothingItem");
const { invalidData, notFound, serverError } = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const { user } = req;
  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: user._id,
  })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      res.status(invalidData).send({ message: err.message });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.send(items);
    })
    .catch((err) => {
      console.error(err);
      res.status(serverError).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .orFail(new Error("Not Found"))
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Not Found") {
        return res.status(notFound).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: err.message });
      }

      return res.status(serverError).send({ message: err.message });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new Error("Not Found"))
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Not Found") {
        return res.status(notFound).send({ message: err.message });
      }
      if (err.message === "ValidationError") {
        return res.status(invalidData).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: err.message });
      }

      return res.status(serverError).send({ message: err.message });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new Error("Not Found"))
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Not Found") {
        return res.status(notFound).send({ message: err.message });
      }
      if (err.message === "ValidationError") {
        return res.status(invalidData).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: err.message });
      }

      return res.status(serverError).send({ message: err.message });
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
// module.exports.createClothingItem = (req, res) => {
//   console.log(req.user._id);
// };
