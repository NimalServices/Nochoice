const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createTravel,
  getAllTravels,
  getTravelById,
  updateTravel,
  deleteTravel,
  getTravels
} = require("../controllers/carrierTravelController");

router.post("/", auth, createTravel);
// router.get("/", auth, getAllTravels);
router.get("/", getTravels);
router.get("/:id", auth, getTravelById);
router.put("/:id", auth, updateTravel);
router.delete("/:id", auth, deleteTravel);

module.exports = router;