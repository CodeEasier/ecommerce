const express = require('express');
const { carts, addCart, deleteCart } = require("../controllers/cart");
const { check } = require("express-validator")
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/carts", carts);
router.post("/addCart", addCart)
router.delete("/deleteCart/:id", deleteCart)

module.exports = router