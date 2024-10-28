const { DataTypes } = require("sequelize");
const sequelize = require("./index").sequelize;
const User = require("./User");

const Friend = sequelize.define("Friend", {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  friendId: { type: DataTypes.INTEGER, allowNull: false },
});

User.belongsToMany(User, {
  through: Friend,
  as: "Friends",
  foreignKey: "userId",
  otherKey: "friendId",
});

module.exports = Friend;
