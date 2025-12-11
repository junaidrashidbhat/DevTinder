const mongoose = require("mongoose");
const validator = require("validator")

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  emailId: {
    type: String,
    required: true,
    lowercase:true,
    trim:true,
     validate: {
    validator: (val) => validator.isEmail(val),
    message: "Invalid email format",
  }
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  photoUrl:{
    type: String,
    required: true,
    default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn6u3pf67IkNX_GS05oj0IP0Wl7isZFFOuFjHjKfsCVnKFcJOHlmVQL0M&s",
      validate: {
    validator: (val) => validator.isURL(val),
    message: "Photo url is wrong email format",
  }
  },
  info:{
    type: String,
    required: true,
    default: "I am a good boy"
  },
  skills:{
    type : [ String ],
    required: true,
  },
 
},
 {
   timestamps : true
  });

// Create unique index explicitly
userSchema.index({ emailId: 1 }, { unique: true });

const UserModel = mongoose.model("User", userSchema);
module.exports = {
  UserModel,
};

