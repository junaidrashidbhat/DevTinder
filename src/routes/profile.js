const express = require("express");
const profileRouter = express.Router();
const { jwtAuth } = require("../middlewears/auth");
const { UserModel } = require("../models/user");

profileRouter.get("/profile/view", jwtAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send({
      message: "Here is your profile : ",
      data: user,
    });
  } catch (err) {
    res.status(401).send("Unauthorised !!!");
  }
});

profileRouter.post("/profile/edit", jwtAuth, async (req, res) => {
  try {
    const userid = req.user._id;
    const data = req.body;
    const notAllowedUpdates = ["emailId"];
    const isNotAllowed = Object.keys(data).some((key) =>
      notAllowedUpdates.includes(key)
    );

    if (isNotAllowed) {
      throw new Error("You cannot change email");
    }

    const user = await UserModel.findByIdAndUpdate(userid, data, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).send("User not found, so can't update");
    }

    res.send({
      status: "success",
      message: "User updated successfully",
      data: user,
    });
  } catch (err) {
    res.status(400).send({
      status: "failed",
      message: err.message,
    });
  }
});

module.exports = { profileRouter };





























function  loop() {

    for(let i = 1;i <= 5; i++){
        setTimeout(()=> {
            console.log(i)
        },i * 1000)
    }
}

loop()




