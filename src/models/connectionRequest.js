const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
    receiverId: { type: mongoose.Schema.Types.ObjectId,ref:"User" },
    status: {
      type: String,
      enum: ["ignored", "intrested", "accepted", "rejected"],
    },
  },
  { timestamps: true }
);

const ConnectRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = { ConnectRequestModel };