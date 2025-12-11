const express = require("express");
const requestRouter = express.Router();
const { jwtAuth } = require("../middlewears/auth");
const { ConnectRequestModel } = require("../models/connectionRequest");
const { UserModel } = require("../models/user");
//Send request to the user
requestRouter.post(
  "/request/send/:status/:toUserId",
  jwtAuth,
  async (req, res) => {
    try {
      const senderId = req.user._id;
      const receiverId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "intrested"];
      if (!allowedStatus.includes(status)) {
        throw new Error("This is not the correct status");
      }

      if (senderId.toString() === receiverId.toString()) {
        throw new Error("You cannot send connection request to yourself");
      }

      const receiverIdValid = await UserModel.exists({ _id: receiverId });
      if (!receiverIdValid) {
        throw new Error("Receiver is not a valid user");
      }

      const connectAlreadyExists = await ConnectRequestModel.exists({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      });

      if (connectAlreadyExists) {
        throw new Error("This connection Request already exists");
      }

      const connectionRequest = new ConnectRequestModel({
        senderId,
        receiverId,
        status,
      });

      const conData = await connectionRequest.save();

      res.send({
        status: "success",
        message: "Connect Request sent successfully!",
        data: conData,
      });
    } catch (err) {
      res.status(400).send({
        status: "failed",
        message: err.message,
      });
    }
  }
);
//accept or decline the user
requestRouter.post(
  "/request/review/:status/:reqId",
  jwtAuth,
  async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
      const requestId = req.params.reqId;
      const status = req.params.status;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        throw new Error("This is not the correct status");
      }

      const updateConnectionRequest =
        await ConnectRequestModel.findOneAndUpdate(
          { _id: requestId, receiverId: loggedInUserId, status: "intrested" },
          { status: status },
          { new: true }
        );
      console.log("🚀 ~ updateConnectionRequest:", updateConnectionRequest);

      if (!updateConnectionRequest) {
        throw new Error("Connection not found");
      }

      res.send({
        status: "success",
        message: "Connection Request" + " " + status + " " + "successfully!",
        data: updateConnectionRequest,
      });
    } catch (err) {
      res.status(400).send({
        status: "failed",
        message: err.message,
      });
    }
  }
);

module.exports = { requestRouter };
