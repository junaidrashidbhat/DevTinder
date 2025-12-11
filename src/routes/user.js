const express = require("express");
const userRouter = express.Router();
const { jwtAuth } = require("../middlewears/auth");
const { ConnectRequestModel } = require("../models/connectionRequest");
const { UserModel } = require("../models/user");

//Get all pending requests / ( Notifications )
userRouter.get("/user/requests/received", jwtAuth, async (req, res) => {
  try {
    const receiverId = req.user._id; //jibran
    const pendingRequests = await ConnectRequestModel.find({
      receiverId: receiverId,
      status: "intrested",
    }).populate(
      "senderId",
      "firstName lastName age gender photoUrl info emailId skills"
    );
    if (pendingRequests.length === 0) {
      res.send("No pending requests found");
      return;
    }

    res.send({
      message: "Fetching request success!",
      data: pendingRequests,
    });
  } catch (err) {
    res.status(400).send({
      status: "failed",
      message: err.message,
    });
  }
});

//Get all my connections
userRouter.get("/user/connections", jwtAuth, async (req, res) => {
  try {
    const loggedinUser = req.user._id; //jibran
    console.log("🚀 ~ loggedinUser:", loggedinUser);
    const status = "accepted";

    const myConnections = await ConnectRequestModel.find({
      $or: [{ senderId: loggedinUser }, { receiverId: loggedinUser }],
      status: status,
    })
      .populate(
        "senderId",
        "firstName lastName age gender photoUrl info skills "
      )
      .populate(
        "receiverId",
        "firstName lastName age gender photoUrl info skills "
      );

    console.log("myConnections", myConnections);

    const filteredData = myConnections.map((row) => {
      if (row.senderId._id.toString() === loggedinUser.toString()) {
        return row.receiverId;
      } else {
        return row.senderId;
      }
    });

    res.send({
      message: "These are your connenctions",
      data: filteredData,
    });
  } catch (err) {
    res.status(400).send({
      status: "failed",
      message: err.message,
    });
  }
});

//Get all the feed/Users
userRouter.get("/user/feed", jwtAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    console.log("🚀 ~ page:", page);
    const limit = parseInt(req.query.limit) || 5;
    console.log("🚀 ~ limit:", limit);
    const skip = (page - 1) * limit;
    console.log("🚀 ~ skip:", skip);

    const loggedinUser = req.user._id;

    const alreadyExistingConnections = await ConnectRequestModel.find({
      $or: [{ senderId: loggedinUser }, { receiverId: loggedinUser }],
    }).select("senderId receiverId");
    const hideUsersFromFeed = new Set();

    alreadyExistingConnections.forEach((req) => {
      hideUsersFromFeed.add(req.senderId.toString());
      hideUsersFromFeed.add(req.receiverId.toString());
    });
    console.log("hideUsersFromFeed", hideUsersFromFeed);

    const filteredFeed = await UserModel.find({
      _id: { $nin: Array.from(hideUsersFromFeed) },
    })
      .select("firstName lastName age gender info skills photoUrl")
      .skip(skip)
      .limit(limit);
    if (filteredFeed.length === 0) {
      res.json({
        message: "Sorry! No users available!",
        data:null
      });
    } else {
      res.json({
        message: "Here are all the users",
        data: filteredFeed,
      });
    }
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
});

module.exports = { userRouter };
