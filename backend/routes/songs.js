import { Router } from "express";
const router = Router();
import axios from "axios";

//route to get a single song route based on its id
router.route("/song/:id").get(async (req, res) => {
  const data = axios.get(`https://api.spotify.com/v1/tracks/${req.params.id}`);
});
