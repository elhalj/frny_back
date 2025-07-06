import express from "express";
import {
  checkAuth,
  login,
  logout,
  signUp,
} from "../controllers/vendor.controller.js";
import { protectVendorRoute } from "../middleware/protectRoute.js";
// import { upload } from "../lib/upload.js";
import multer from "multer";
const upload = multer({ dest: "uploads" });

export const vendorRoutes = express.Router();

vendorRoutes.post("/signUp", /*upload.single("profilePic"),*/ signUp);
vendorRoutes.post("/login", login);
vendorRoutes.post("/logout", logout);

vendorRoutes.get("/check", protectVendorRoute, checkAuth);
// vendorRoutes.get("/getClient", protectVendorRoute, getClient);
