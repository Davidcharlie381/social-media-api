const mongoose = require("mongoose");
// const validator = require("validator");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Provide an email address"],
      // validate: [validator.isEmail, "Enter a valid email"],
      lowercase: true,
      trim: true,
      unique: [true, "Email already in use"],
    },
    password: {
      type: String,
      required: [true, "Provide a password"],
      minLength: [6, "Password too short"],
    },
    username: {
      type: String,
      sparse: true,
      lowercase: true,
      trim: true,
      unique: [true, "Username already in use"],
    },
    firstName: {
      type: String,
      minLength: [3, "Firstname too short"],
    },
    lastName: {
      type: String,
      minLength: [3, "Lastname too short"],
    },
    avatarUrl: String,
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.virtual("fullName").set(function () {
  this.fullName = this.firstName + " " + this.lastName;
});

UserSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// UserSchema.pre("save", async function (next) {
//   try {
//     const hashedPassword = await bcrypt.hash(this.password, 10);
//     this.password = hashedPassword;
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// UserSchema.methods.isValidPassword = async function (password) {
//   const valid = await bcrypt.compare(password, this.password);
//   return valid;
// };

const User = mongoose.model("User", UserSchema);

module.exports = User;
