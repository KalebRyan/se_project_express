const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);

router.post("/", createItem);

router.delete("/:itemId", deleteItem);

module.exports = router;
