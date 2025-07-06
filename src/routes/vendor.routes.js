import express from "express";
import {
  checkAuth,
  login,
  logout,
  signUp,
} from "../controllers/vendor.controller.js";
import { protectVendorRoute } from "../middleware/protectRoute.js";
import { uploadAdminImage } from "../lib/uploadAdminProfile.js";

export const vendorRoutes = express.Router();

vendorRoutes.post("/signUp", uploadAdminImage, signUp);
vendorRoutes.post("/login", login);
vendorRoutes.post("/logout", logout);

vendorRoutes.get("/check", protectVendorRoute, checkAuth);
// vendorRoutes.get("/getClient", protectVendorRoute, getClient);
