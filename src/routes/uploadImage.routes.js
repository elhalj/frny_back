import express from "express";
import cloudinary from "../lib/cloudinary.js";
import multer from "multer";

const uploadRoute = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image provided" });
    }
    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({ message: "File is not an image" });
    }
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataUri = `data:${file.mimetype};base64,${b64}`;

    const uploadResponse = await cloudinary.uploader.upload(dataUri);
    console.log("Image uploaded successfully:", uploadResponse.secure_url);

    res.status(201).json({ url: uploadResponse.secure_url });
  } catch (error) {
    console.error("Erreur d'upload:", error?.message || "Inconnue");
    res.status(500).json({ error: "Failed to upload image" });
  }
};

uploadRoute.post("/upload", upload.single("image"), uploadImage);

export default uploadRoute;
