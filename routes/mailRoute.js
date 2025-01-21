const express = require("express");
const { sendStoredEmail } = require("../controllers/sendMailerController");

const router = express.Router();

router.post("/sendmail", sendStoredEmail);

module.exports = router;
