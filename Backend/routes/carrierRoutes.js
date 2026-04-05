const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
  createCarrier,
  getAllCarriers,
  getCarrierById,
  updateCarrier,
  deleteCarrier
} = require("../controllers/carrierController");

router.post("/", auth, role("admin"), createCarrier);
router.get("/", getAllCarriers);
router.get("/:id", auth, getCarrierById);
router.put("/:id", auth, role("admin"), updateCarrier);
router.delete("/:id", auth, role("admin"), deleteCarrier);

module.exports = router;