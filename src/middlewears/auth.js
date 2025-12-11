const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user");
const jwtAuth = async (req, res, next) => {
  //read the token
  //validate
  //find user esistance
  try {
    console.log("req.cookies", req.cookies)
    const { token } = req.cookies;
  

    const verifiedCookieToken = await jwt.verify(token, "anySecretKey");
    console.log("🚀 ~ auth ~ verifiedCookieToken:", verifiedCookieToken)
    const userId  = verifiedCookieToken._id;
    console.log("userId",userId)
    const user = await UserModel.findOne({_id : userId });
    // console.log("user---after get data", user)
    req.user = user
    next();
  } catch (err) {
    console.log("err",err)
    if (err.name === "TokenExpiredError") {
      return res.status(401).send("Token expired, please login again");
    }else{
      return res.status(401).send("Please Login again!");

    }
  }
};

module.exports = { jwtAuth };
