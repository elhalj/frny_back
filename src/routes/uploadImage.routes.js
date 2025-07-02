import express from "express";
import cloudinary from "../lib/cloudinary.js";
import multer from "multer";

const uploadRoute = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });
uploadRoute.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Not image given" });
    }
    //Convert the Buffer in base64
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${b64}`;

    //Upload to Cloudinary
    const uploadResponse = cloudinary.uploader.upload(dataUri, {
      folder: "articles",
    });

    res.status(200).json({ url: uploadResponse.secure_url });
  } catch (error) {
    console.error("Erreur d'upload:", error);
    res.status(500).json({ error: "Échec de l'upload de l'image" });
  }
});

export default uploadRoute;
