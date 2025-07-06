import express from "express";
import { protectVendorRoute } from "../middleware/protectRoute.js";
import {
  addArticle,
  deleted,
  getArticle,
  getVendorArticle,
  updated,
} from "../controllers/article.controller.js";
import { uploadArticleImage } from "../lib/upload.js";

export const articleRoutes = express.Router();

articleRoutes.post("/add", protectVendorRoute, uploadArticleImage, addArticle);

articleRoutes.get("/getArticle/me", protectVendorRoute, getVendorArticle);
articleRoutes.get("/get", getArticle);
articleRoutes.put("/update/:id", protectVendorRoute, updated);
articleRoutes.delete("/delete/:id", protectVendorRoute, deleted);
