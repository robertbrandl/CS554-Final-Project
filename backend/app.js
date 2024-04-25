import express from "express";
const app = express();
import session from "express-session";
import configRoutes from "./routes/routeindex.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "AuthState",
    secret: "secret session",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 },
  })
);

configRoutes(app);

app.listen(3000, () => {
  console.log("Server is running!!");
  console.log("Your routes will be running on http://localhost:3000");
});
