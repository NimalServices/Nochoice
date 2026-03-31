const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createTravel,
  getAllTravels,
  getTravelById,
  updateTravel,
  deleteTravel
} = require("../controllers/carrierTravelController");

router.post("/", auth, createTravel);
router.get("/", auth, getAllTravels);
router.get("/:id", auth, getTravelById);
router.put("/:id", auth, updateTravel);
router.delete("/:id", auth, deleteTravel);

module.exports = router;