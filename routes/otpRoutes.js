const express = require("express");
const {
  generateOtp,
  verifyOtp,
  resendOtp,
} = require("../controllers/otpController");

const router = express.Router();

router.post("/generate", generateOtp);
router.post("/verify", verifyOtp);
router.post("/resend", resendOtp);

module.exports = router;
