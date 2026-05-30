const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware"); // ← one import now
const {
  createTravel,
  getAllTravels,
  getTravelById,
  updateTravel,
  deleteTravel
} = require("../controllers/carrierTravelController");

router.post("/", verifyToken, createTravel);
router.get("/", verifyToken, getAllTravels);
router.get("/:id", verifyToken, getTravelById);
router.put("/:id", verifyToken, updateTravel);
router.delete("/:id", verifyToken, deleteTravel);

module.exports = router;