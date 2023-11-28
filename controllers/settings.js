const { UnauthenticatedError, BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");

const changePassword = async (req, res) => {
  const { currentPassword, password, confirmPassword } = req.body;
  const { userId } = req.user;

  const user = await User.findById(userId);

  if (!user || !(await user.comparePassword(currentPassword))) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  if (password !== confirmPassword) {
    throw new BadRequestError("password and confirm password must be the same");
  }

  user.password = confirmPassword;
  console.log(confirmPassword);

  user.save();

  res.status(StatusCodes.OK).json({
    msg: "password successfully change",
  });
};

module.exports = { changePassword };
