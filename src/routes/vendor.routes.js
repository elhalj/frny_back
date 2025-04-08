import express from "express";
import {
  checkAuth,
  login,
  logout,
  signUp,
} from "../controllers/vendor.controller.js";
import { protectVendorRoute } from "../middleware/protectRoute.js";

export const vendorRoutes = express.Router();

vendorRoutes.post("/signUp", signUp);
vendorRoutes.post("/login", login);
vendorRoutes.post("/logout", logout);

vendorRoutes.get("/check", protectVendorRoute, checkAuth);
// vendorRoutes.get("/getClient", protectVendorRoute, getClient);
