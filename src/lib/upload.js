import multer from "multer";
import * as path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.resolve(__dirname, "../../upload/articles/"); // Chemin absolu

fs.mkdir(uploadDir, { recursive: true }, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Directory ${uploadDir} created`);
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSurfix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "article-" + uniqueSurfix + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedType = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedType.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Type de fichier non supporté"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, //5MB
});

export const uploadArticleImage = upload.single("image");
