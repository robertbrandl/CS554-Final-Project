import { Router } from "express";
const router = Router();
import axios from "axios";
import redis from "redis";
const client = redis.createClient();
client.connect();
//route to get a single song route based on its id
router.route("/song/:id").get(async (req, res) => {

  //check redis if SongID is cached
  let foundSong = await client.get("songId".concat(req.params.id));
  let songData;

  
  if (foundSong) {
    console.log("songId",req.params.id, "found in cache, returning it");
    songData = JSON.parse(foundSong);

  } else {
    // Get the song data from the Deezer API
    const response = await axios.get(`https://api.deezer.com/track/${req.params.id}`);
    songData = response.data

    // Set the Redis cache
    await client.set("songId".concat(req.params.id), JSON.stringify(songData));
    console.log("SongId",req.params.id, "is set in cache");
  }
  
    console.log(songData)
    return res.status(200).json(songData);
});

router.route("/search/:query").get(async (req, res) => {

  let foundSongs = await client.get("search-".concat(req.params.query));
  let songData;

  if (foundSongs) {
    console.log("songs",req.params.query, "found in cache, returning it");
    songData = JSON.parse(foundSongs);

  } else {
    const response = await axios.get(`https://api.deezer.com/search?q=${req.params.query}`);
    songData = response.data

    await client.set("search-".concat(req.params.query), JSON.stringify(songData));
    console.log("Songs",req.params.query, "is set in cache");
  }
  
    console.log(songData)
    return res.status(200).json(songData);
});

export default router;
