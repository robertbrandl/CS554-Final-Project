import { Router } from "express";
const router = Router();
import { playlistData } from "../data/index.js";
//route to get a single song route based on its id
router.route("/playlist/:id").get(async (req, res) => {
    try{
        const data = await playlistData.getPlaylist(req.params.id);
        return res.status(200).json(data);
    }catch(e){
        return res.status(500).json({error: e});
    }
  });
export default router;