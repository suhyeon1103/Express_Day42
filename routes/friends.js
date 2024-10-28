const express = require("express");
const router = express.Router();
const Friend = require("../models/Friend");
const User = require("../models/User");
const authenticate = require("../middleware/authenticate");
const CustomeError = require("../utils/CustomError");

router.post("/add", authenticate, async (req, res, next) => {
  try {
    const { friendId } = req.body;
    const friend = await User.findByPk(friendId);
    if (!friend) {
      return next(new CustomeError("User not found", 404));
    }
    await Friend.create({ userId: req.user.id, friendId });
    res.json({ message: "Friend added successfully" });
  } catch (err) {
    next(err);
  }
});

router.get("/", authenticate, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: User, as: "Friends", attribute: ["id", "username"] }],
    });
    res.json(user.Friends);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
