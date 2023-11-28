const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
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
    .json({ user: { firstname: user.firstname }, token });
};

const forgotPassword = async (req, res) => {
  /*
  Steps
  1. validate email 
  2. generate token with 20mins expire
  3. add the token to the user  
  4. send email with unique link
  5. verify token
  6. update password
*/
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError(`${email} not found`);
  }

  const token = user.genString();

  const resetToken = token;
  const resetTokenExpires = new Date();
  resetTokenExpires.setMinutes(resetTokenExpires.getMinutes() + 15);

  user.resetToken = resetToken;
  user.tokenExpires = resetTokenExpires;

  await user.save();

  //email next time for now just a redirect

  res
    .status(StatusCodes.OK)
    .json({ msg: "Reset token generated successfully" });
};

const uniqueChangePassword = async (req, res) => {
  const { currentPassword, password, confirmPassword } = req.body;
  const { token } = req.params;

  const user = await User.findOne({
    resetToken: token,
  });

  if (!user) {
    throw new NotFoundError("Invalid or expired token");
  }

  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  if (password !== confirmPassword) {
    throw new BadRequestError("password and confirm password must be the same");
  }

  user.password = confirmPassword;
  user.save();

  user.resetToken = undefined;
  user.tokenExpires = undefined;

  res.status(StatusCodes.OK).json({ msg: "password changed successfully" });
};

module.exports = {
  register,
  login,
  forgotPassword,
  uniqueChangePassword,
};
