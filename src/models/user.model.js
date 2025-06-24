import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: { type: String },
    city: { type: String },
    municipality: { type: String },
    street: { type: String },
    image: {
      type: String,
      default: "https://i.imgur.com/4M8bQ2H.png",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
