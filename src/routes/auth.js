const bcrypt = require("bcrypt");
const { UserModel } = require("../models/user");
const express = require("express");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");

authRouter.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      password,
      emailId,
      age,
      gender,
      photoUrl,
      info,
      skills,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      firstName,
      lastName,
      password: hashedPassword,
      emailId,
      age,
      gender,
      photoUrl,
      info,
      skills,
    });
    await user.save();
    res.send("user inserted in to the db");
  } catch (err) {
    res.status(400).send({
      status: "failed",
      message: err.message,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    console.log("req.body",req.body)
    const { emailId, password } = req.body;
    console.log("emailId",emailId)
    const user = await UserModel.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("User not found Sir!");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      //create jwt
      const token = await jwt.sign({ _id: user._id }, "anySecretKey", {
        expiresIn: "7d",
      });
      //add to ccokie//send back to user
      res.cookie("token", token, {
  httpOnly: true,
  secure: false,    // set true only in production HTTPS
  sameSite: "lax",  // or "none" ONLY if using https & cross-domain
});


      res.send({
message: "Login Successful!! ---- JWT signature created and stored in the cookie",
        data: user
      }
        
);


    } else {
      throw new Error("Wrong password");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  try {
res.clearCookie("token", {
  httpOnly: true,
  secure: false,
  sameSite: "lax"
});




    return res.status(200).send("Logged out successfully");
  } catch (err) {
    return res.status(500).send("Logout failed");
  }
});



module.exports = { authRouter };
