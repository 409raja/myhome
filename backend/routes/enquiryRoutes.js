const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createEnquiry,
  getMyEnquiries,
  updateEnquiryStatus
} = require("../controllers/enquiryController");

const router = express.Router();

router.post("/", createEnquiry);
router.get("/my", protect, getMyEnquiries);
router.put("/:id", protect, updateEnquiryStatus);

module.exports = router;
