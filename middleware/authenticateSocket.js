const jwt = require("jsonwebtoken");
const User = require("../models/User");
const CustomError = require("../utils/CustomError");

module.exports = async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new CustomError("No token provided", 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return next(new CustomError("User not found", 401));
    }
    socket.user = user;
    next();
  } catch (err) {
    next(new CustomError("Invalid token", 401));
  }
};
