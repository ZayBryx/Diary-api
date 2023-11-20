const { BadRequestError, UnauthenticatedError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.genToken();

  res
    .status(StatusCodes.CREATED)
    .json({ user: { firstname: user.firstname }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordOK = await user.comparePassword(password);
  if (!isPasswordOK) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = user.genToken();
  res
    .status(StatusCodes.OK)
    .json({ user: { firstname: user.firstname, userId: user._id }, token });
};

module.exports = {
  register,
  login,
};
