const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  roomId: { type: String, required: true },
  createAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
