const CustomAPIError = require("./custom-api");
const BadRequestError = require("./bad-request");
const UnauthenticatedError = require("./unathenticated");
const NotFoundError = require("./not-found");

module.exports = {
  CustomAPIError,
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
};
