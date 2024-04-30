import { Router } from "express";
const router = Router();
import { playlistData } from "../data/index.js";
import {searchData} from "../config/elasticSync.js" ;
//route to get a single song route based on its id
router.route("/playlist/:id").get(async (req, res) => {
    try{
        const data = await playlistData.getPlaylist(req.params.id);
        return res.status(200).json(data);
    }catch(e){
        return res.status(e.code).json({error: e.error});
    }
  });
router.route("/allplaylists").get(async (req, res) => {
    try{
        const data = await playlistData.getAllPlaylists();
        return res.status(200).json(data);
    }catch(e){
        return res.status(500).json({error: e});
    }
});
router.route("/searchbyname").get(async (req, res) => {
    try{
        const data = await searchData(req.query.name);
        return res.status(200).json(data);
    }catch(e){
        return res.status(500).json({error: e});
    }
});
export default router;