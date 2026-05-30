const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// All routes protected by verifyToken + isAdmin
router.get("/stats", verifyToken, isAdmin, adminController.getStats);
router.get("/carriers", verifyToken, isAdmin, adminController.getAllCarriers);
router.get("/carriers/pending", verifyToken, isAdmin, adminController.getPendingCarriers);
router.put("/carriers/:id/approve", verifyToken, isAdmin, adminController.approveCarrier);
router.delete("/carriers/:id", verifyToken, isAdmin, adminController.deleteCarrier);
router.get("/travels", verifyToken, isAdmin, adminController.getAllTravels);
router.get("/users", verifyToken, isAdmin, adminController.getAllUsers);

module.exports = router;