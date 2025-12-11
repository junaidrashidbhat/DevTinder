const express = require("express");
const app = express();
const port = 3000;
const { UserModel } = require("../src/models/user");
const mongoose = require("mongoose");
const connectDB = require("../src/config/database");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const { authRouter } = require("../src/routes/auth");
const { profileRouter } = require("../src/routes/profile");
const { requestRouter } = require("../src/routes/connectionRequest");
const { userRouter } = require("../src/routes/user");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());

// Sign up
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

app.delete("/delete", async (req, res) => {
  try {
    const userid = req.body.userid;

    const user = await UserModel.findByIdAndDelete(userid);
    if (!user) {
      return res.status(404).send("User not found, so cant delete");
    }

    res.send("This is your user that was deleted: " + user);
  } catch (err) {}
});

// app.get("/feed", async (req, res) => {
//   try {
//     const names = await UserModel.distinct("firstName");
//     res.send(names);
//   } catch (err) {
//     res.status(500).send("Server error");
//   }
// });

const startServer = async () => {
  await connectDB(); // wait for actual connection
  console.log("mongoose state:", mongoose.connection.readyState);

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

startServer();
