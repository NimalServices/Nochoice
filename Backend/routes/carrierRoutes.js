const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware"); // ← one import now
const {
  createCarrier,
  getAllCarriers,
  getCarrierById,
  updateCarrier,
  deleteCarrier,
  registerCarrier
} = require("../controllers/carrierController");

router.post("/", createCarrier);
router.post("/register", registerCarrier);
router.get("/", verifyToken, getAllCarriers);
router.get("/:id", verifyToken, getCarrierById);
router.put("/:id", verifyToken, authorizeRoles("admin"), updateCarrier);
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteCarrier);

module.exports = router;