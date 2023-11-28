const express = require("express");
const router = express.Router();

const { changePassword } = require("../controllers/settings");

router.patch("/change-password", changePassword);

module.exports = router;
