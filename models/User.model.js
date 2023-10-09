const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      match: /^\S+@\S+\.\S+$/,
    },
    permissions: {
      type: [String],
      require: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
    },
    avatar: {
      type: String,
      required: true,
    },
    isEnable: {
      type: Boolean,
      require: true
    },
    isActive: {
      type: Boolean,
      require: true
    }
  },
  { timestamps: true }
);

const User = model("User", UserSchema);
module.exports = User