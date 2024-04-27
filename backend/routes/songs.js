import { Router } from "express";
const router = Router();
import axios from "axios";

//route to get a single song route based on its id
router.route("/song/:id").get(async (req, res) => {
  const data = await axios.get(`https://api.deezer.com/track/${req.params.id}`);
  console.log(data.data);
  return res.status(200).json(data.data);
});

export default router;
