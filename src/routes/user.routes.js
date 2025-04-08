import express from "express";
import {
  checkAuthUser,
  getMyArticle,
  login,
  logout,
  signUp,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/protectUserRoute.js";

export const userRoutes = express.Router();

userRoutes.post("/signUp", signUp);
userRoutes.post("/login", login);
userRoutes.post("/logout", logout);

userRoutes.get("/check", protectRoute, checkAuthUser);
userRoutes.get("/getMyArticle", protectRoute, getMyArticle);
