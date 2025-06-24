import express from "express";
import {
  checkAuthUser,
  getMyArticle,
  login,
  logout,
  signUp,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/protectUserRoute.js";
import { upload } from "../lib/upload.js";

export const userRoutes = express.Router();

userRoutes.post("/signUp", upload.single("image"), signUp);
userRoutes.post("/login", login);
userRoutes.post("/logout", logout);

userRoutes.get("/check", protectRoute, checkAuthUser);
userRoutes.get("/getMyArticle", protectRoute, getMyArticle);
