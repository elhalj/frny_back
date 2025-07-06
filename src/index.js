import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { _connectDb } from "./database/db.js";
import { vendorRoutes } from "./routes/vendor.routes.js";
import { userRoutes } from "./routes/user.routes.js";
import { articleRoutes } from "./routes/article.routes.js";
import commandeRoutes from "./routes/commande.routes.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Bienvenu sur le server");
});

app.use("/api/vendor", vendorRoutes);
app.use("/api/user", userRoutes);
app.use("/api/article", articleRoutes);
app.use("/api/commande", commandeRoutes);
app.use(
  "/uploads/articles",
  express.static(path.join(__dirname, "../upload/articles"), {
    setHeaders: (res) => {
      res.set("Cache-Control", "public, max-age=31536000");
    },
  })
);

app.listen(port, () => {
  console.log(`server running on port http://localhost:${port}`);
  _connectDb();
});
