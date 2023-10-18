const express = require('express');
const { smartPhone, addSmartPhone, updateSmartPhone, deleteSmartPhone } = require("../controllers/smartPhone");
const { check } = require("express-validator")
const router = express.Router();

router.get("/smartPhone", smartPhone);
router.post("/addSmartPhone", addSmartPhone)
router.put("/updateSmartPhone/:id", updateSmartPhone)
router.delete("/deleteSmartPhone/:id", deleteSmartPhone)

module.exports = router