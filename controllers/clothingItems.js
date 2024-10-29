const ClothingItem = require("../models/clothingItem");

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
      res.status(201).json(item);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.send(items);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.status(200).json(item);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

module.exports = { createItem, getItems, deleteItem };
