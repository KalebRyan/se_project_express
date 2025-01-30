const ClothingItem = require("../models/clothingItem");
const {
  invalidData,
  notFound,
  serverError,
  forbidden,
} = require("../utils/errors");

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
      if (err.name === "ValidationError") {
        return res.status(invalidData).send({ message: err.message });
      }
      return res
        .status(serverError)
        .send({ message: "An error has occurred on the server" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.send(items);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(serverError)
        .send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        const err = new Error("Forbidden");
        err.status = 403;
        throw err;
      }
      return item
        .deleteOne()
        .then(() => res.status(200).send({ message: "Item deleted" }));
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Not Found") {
        return res.status(notFound).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: err.message });
      }
      if (err.message === "Forbidden") {
        return res.status(forbidden).send({ message: err.message });
      }

      return res
        .status(serverError)
        .send({ message: "An error has occurred on the server" });
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

      return res
        .status(serverError)
        .send({ message: "An error has occurred on the server" });
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

      return res
        .status(serverError)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
