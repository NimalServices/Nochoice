const express = require("express");
const router = express.Router();
const { register, login,loginCarrier } = require("../controllers/authController");

router.post("/register", register);
// router.post("/login", login);
router.post("/login", loginCarrier);

module.exports = router;