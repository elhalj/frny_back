import mongoose from "mongoose";
import { Article } from "./article.model.js";

const vendorSchema = new mongoose.Schema(
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
    address: {
      city: {
        type: String,
        required: true,
      },
      municipality: {
        type: String,
        required: true,
      },
      number: {
        type: String,
        required: true,
      },
    },
    gender: {
      type: String,
      required: true,
      enum: ["Homme", "Femme"],
    },
    profilePic: {
      type: String,
      required: true,
    },
    // articles: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Article",
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

export const Vendor = mongoose.model("Vendor", vendorSchema);
