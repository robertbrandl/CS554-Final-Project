import express from "express";
const app = express();
import session from "express-session";
import configRoutes from "./routes/routeindex.js";
import cors from "cors";
import dotenv from "dotenv";
import { contentMiddleware } from "api-security-middleware";
import multer from "multer";

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// SQL Detection
app.use(contentMiddleware.sqlDetectionMiddleware());

// XSS Detection
app.use(contentMiddleware.xssDetectionMiddleware());

app.use(
  session({
    name: "AuthState",
    secret: "secret session",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 },
  })
);

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Only PNG files are allowed"));
    }
  },
});
app.use(upload.single("albumCover"));

configRoutes(app);

app.listen(3000, () => {
  console.log("Server is running!!");
  console.log("Your routes will be running on http://localhost:3000");
});
