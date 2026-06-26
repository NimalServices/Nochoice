const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const { register, login, forgotPassword, verifyResetToken, resetPassword } = require("../controllers/authController");

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many password reset requests. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.get("/verify-reset-token/:token", verifyResetToken);
router.post("/reset-password/:token", resetPassword);

module.exports = router;