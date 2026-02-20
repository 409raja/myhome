const express = require("express");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const checkRole = require("../middleware/roleMiddleware");

const {
  createProperty,
  getProperties,
  getMyProperties,
  updateProperty,
  deleteProperty,
  approveProperty,
  getSingleProperty,
  getPendingProperties,
  getFeaturedProperties,
  markFeatured 

} = require("../controllers/propertyController");

const router = express.Router();

router.post("/", protect, upload.array("images", 10), createProperty);
router.get("/my", protect, getMyProperties);
router.put("/:id", protect, updateProperty);
router.put("/:id/approve", protect, checkRole("admin"), approveProperty);
router.delete("/:id", protect, deleteProperty);
router.get("/pending", protect, checkRole("admin"), getPendingProperties);
router.get("/", getProperties);
router.get("/:id", getSingleProperty);
router.get("/featured", getFeaturedProperties);
router.put("/:id/feature", protect, checkRole("admin"), markFeatured);

module.exports = router;
