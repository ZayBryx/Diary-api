const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  uniqueChangePassword,
} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.patch("/forgot-password", forgotPassword);
router.patch("/change-password/:token", uniqueChangePassword);

module.exports = router;
