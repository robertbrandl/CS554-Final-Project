import { Router } from "express";
const router = Router();
import { playlistData } from "../data/index.js";
import {searchData} from "../config/elasticSync.js" ;
import { createClient } from 'redis';
const client = createClient();
client.connect().then(() => {});
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
    let exists = await client.exists(`allplaylists`);//this helps with the elasticsearch bc less syncing needed!
    if (exists) {
        let result = await client.get(`allplaylists`);
        return res.status(200).json(JSON.parse(result));
    }
    else{
        try{
            const data = await playlistData.getAllPlaylists();
            await client.SETEX(`allplaylists`, 3600, JSON.stringify(data));
            return res.status(200).json(data);
        }catch(e){
            return res.status(500).json({error: e});
        }
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