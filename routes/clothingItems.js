const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
} = require("../controllers/clothingItems");

router.get("/items", getItems);

router.post("/items", createItem);

router.delete("/items/:itemId", deleteItem);

module.exports = router;
